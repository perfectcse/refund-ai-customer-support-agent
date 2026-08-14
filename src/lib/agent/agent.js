import OpenAI from "openai";
import { agentTools, executeTool } from "./tools";
import { runLocalAgent } from "./local-agent";

function normalizeOpenAIError(error) {
  const status = error?.status ?? error?.response?.status ?? null;
  const errorCode = error?.code ?? error?.error?.code ?? null;
  const detail =
    error?.error?.message ??
    error?.message ??
    "OpenAI request failed.";

  if (
    status === 429 ||
    errorCode === "insufficient_quota" ||
    /quota|billing/i.test(detail)
  ) {
    const quotaError = new Error(
      "OpenAI API quota exceeded."
    );

    quotaError.status = 429;
    quotaError.code = "insufficient_quota";

    return quotaError;
  }

  if (
    status === 401 ||
    errorCode === "invalid_api_key" ||
    /api key|invalid/i.test(detail)
  ) {
    const authError = new Error(
      "OpenAI authentication failed. Check OPENAI_API_KEY in your .env.local file."
    );

    authError.status = 401;
    authError.code = "invalid_api_key";

    return authError;
  }

  return error;
}

function getOpenAIClient() {
  const apiKey =
    process.env.OPENAI_API_KEY ||
    process.env.OPENAI_ADMIN_KEY;

  if (!apiKey) {
    const missingKeyError = new Error(
      "Missing OpenAI credentials. Set OPENAI_API_KEY in your .env.local file."
    );

    missingKeyError.status = 401;
    missingKeyError.code = "missing_api_key";

    throw missingKeyError;
  }

  return new OpenAI({
    apiKey
  });
}

const SYSTEM_PROMPT = `
You are RefundAI, an AI customer support agent responsible for handling
e-commerce refund requests.

Your job is to help customers with refund requests while strictly following
the company's refund policy.

Rules:

1. Never invent customer or order information.
2. Use CRM tools to retrieve customer and order information.
3. Always use checkRefundEligibility before approving or denying a refund.
4. Never override the refund policy.
5. Explain refund decisions clearly to the customer.
6. If required information is missing, ask the customer for it.
7. Do not claim a refund was processed unless the appropriate refund tool
   confirms it.
8. Keep responses concise and professional.
`;


// --------------------------------------------------
// Main Agent
// --------------------------------------------------

export async function runAgent(messages) {
  try {
    return await runOpenAIAgent(messages);
  } catch (error) {
    const normalizedError = normalizeOpenAIError(error);

    // OpenAI quota unavailable
    if (
      normalizedError.status === 429 ||
      normalizedError.code === "insufficient_quota"
    ) {
      console.warn(
        "OpenAI quota unavailable. Switching to local demo agent."
      );

      return runLocalAgent(messages);
    }

    throw normalizedError;
  }
}


// --------------------------------------------------
// OpenAI Agent
// --------------------------------------------------

async function runOpenAIAgent(messages) {
  const openai = getOpenAIClient();

  const conversation = [
    {
      role: "system",
      content: SYSTEM_PROMPT
    },
    ...messages
  ];

  const maxIterations = 6;

  for (
    let iteration = 0;
    iteration < maxIterations;
    iteration++
  ) {
    let response;

    try {
      response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: conversation,
        tools: agentTools,
        tool_choice: "auto"
      });
    } catch (error) {
      throw normalizeOpenAIError(error);
    }

    const message = response.choices[0].message;

    conversation.push(message);

    // -----------------------------------------------
    // No tool call = final agent response
    // -----------------------------------------------

    if (
      !message.tool_calls ||
      message.tool_calls.length === 0
    ) {
      return {
        response: message.content,
        messages: conversation,
        mode: "openai"
      };
    }

    // -----------------------------------------------
    // Execute requested tools
    // -----------------------------------------------

    for (const toolCall of message.tool_calls) {
      const toolName = toolCall.function.name;

      let toolArguments;

      // Parse tool arguments
      try {
        toolArguments = JSON.parse(
          toolCall.function.arguments
        );
      } catch (error) {
        conversation.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify({
            error: "Invalid tool arguments."
          })
        });

        continue;
      }

      let toolResult;

      // Execute tool
      try {
        toolResult = executeTool(
          toolName,
          toolArguments
        );
      } catch (error) {
        toolResult = {
          error: error.message
        };
      }

      // Send tool result back to OpenAI
      conversation.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(toolResult)
      });
    }
  }

  throw new Error(
    "Agent exceeded maximum tool iterations."
  );
}