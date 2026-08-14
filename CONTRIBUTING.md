# Contributing to RefundAI

Thank you for your interest in contributing to RefundAI! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and adhere to our Code of Conduct:

- Be respectful and inclusive
- Welcome people of all backgrounds and identities
- Focus on constructive feedback
- Report inappropriate behavior to maintainers

## How to Contribute

### Reporting Bugs

Found a bug? Please help us fix it! Here's how to report:

1. **Search existing issues** first to avoid duplicates
2. **Use a clear, descriptive title**
3. **Provide a detailed description** including:
   - What you were doing when the bug occurred
   - What you expected to happen
   - What actually happened
   - Screenshots or error messages if applicable
   - Your environment (OS, Node version, etc.)

**Example:**
```
Title: Chat input breaks on long customer IDs

Description:
When entering a customer ID longer than 20 characters, the chat input field 
expands beyond the container. Expected the input to wrap or truncate gracefully.

Steps to reproduce:
1. Go to /chat
2. Paste a 50-character string into the input field
3. Input expands beyond container boundaries
```

### Suggesting Features

Have an idea for an improvement? We'd love to hear it!

1. **Use a clear, descriptive title**
2. **Provide a detailed description** of the feature
3. **Explain the use case** and why it would be valuable
4. **Include examples** of how it would work

**Example:**
```
Title: Add support for partial refunds

Description:
Currently, the system processes full refunds only. It would be helpful to 
support partial refund amounts for cases where customers want to return 
only part of their order.

Use case:
Multi-item orders where customers want to refund individual items.

Proposed implementation:
Add a "refund_amount" parameter to the calculateRefund tool, allowing 
customers to specify amounts between 0 and the full order amount.
```

### Submitting Pull Requests

We actively welcome pull requests! Here's the process:

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/refund-ai-customer-support-agent.git
   cd refund-ai-customer-support-agent
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or for fixes:
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**
   - Write clear, concise code
   - Add comments for complex logic
   - Follow the project's code style
   - Test your changes with the demo scenarios

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add partial refund support"
   # or
   git commit -m "fix: resolve chat input width issue"
   ```

   Use conventional commits:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting
   - `refactor:` for code restructuring
   - `test:` for tests
   - `chore:` for maintenance

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues (#123)
   - Include screenshots for UI changes
   - Ensure tests pass (`npm run build`)

7. **Address review feedback**
   - Respond to comments
   - Make requested changes
   - Push updates to the same branch

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Clone and install
git clone <repo-url>
cd refund-ai-customer-support-agent
npm install

# Create environment file
echo "OPENAI_API_KEY=sk-..." > .env.local

# Start dev server
npm run dev

# Visit http://localhost:3000
```

### Running Tests
```bash
# Build to check for errors
npm run build

# Test demo scenarios
# Go to /admin and run through all three scenarios
```

## Code Style

### JavaScript/JSX
- Use ES6+ syntax
- Use meaningful variable names
- Add comments for complex logic
- Keep functions focused and modular

**Example:**
```javascript
// ✅ Good
export function checkRefundEligibility(customerId, orderId) {
  const customer = getCustomerById(customerId);
  
  if (!customer) {
    return {
      eligible: false,
      reason: "Customer not found."
    };
  }
  
  // Continue validation...
}

// ❌ Avoid
function chk(cid, oid) {
  const c = getCustomerById(cid);
  if (!c) return { e: false };
  // ...
}
```

### CSS
- Use descriptive class names
- Follow BEM naming convention where appropriate
- Group related styles together
- Add comments for complex selectors

**Example:**
```css
/* ✅ Good */
.timeline-item {
  /* layout styles */
}

.timeline-item.success {
  /* success state */
}

.timeline-item::before {
  /* pseudo-element */
}

/* ❌ Avoid */
.ti { /* meaningless */ }
.s { /* too generic */ }
```

## Testing Your Changes

1. **Functional Testing**
   - Test in dev mode (`npm run dev`)
   - Try all three demo scenarios in admin dashboard
   - Test on mobile (DevTools device toolbar)
   - Verify error handling

2. **Build Testing**
   - Run `npm run build` to ensure production build works
   - Check for TypeScript errors
   - Verify no console warnings/errors

3. **Browser Compatibility**
   - Chrome/Edge (latest)
   - Firefox (latest)
   - Safari (latest)
   - Mobile browsers

## Project Structure

When adding new features, follow the existing structure:

```
src/
├── components/     # Reusable React components
├── lib/           # Utility functions and business logic
├── app/           # Next.js pages and layouts
└── data/          # Mock data and database access
```

## Asking Questions

- **Discord/Discussions**: Use GitHub Discussions for questions
- **Issues**: Search existing issues before asking
- **Documentation**: Check README and inline comments

## Review Process

All PRs undergo review by maintainers:
- Code quality and style
- Test coverage
- Performance impact
- Security considerations
- Documentation updates

Maintainers may request changes or provide suggestions. This is normal and helps maintain project quality.

## Merging

Once approved, PRs will be merged by maintainers. After merging:
- Branches are deleted
- Changes appear in the `main` branch
- Next release includes your contribution

## Recognition

Contributors will be:
- Listed in this file
- Mentioned in release notes
- Credited in commit history

Thank you for contributing to RefundAI! 🎉

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Questions?** Open an issue or start a discussion. We're here to help!
