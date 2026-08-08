// Simple calculator logic
document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('display');
  const buttons = document.querySelectorAll('.btn');
  let expr = ''; // expression in JS-friendly form (uses * and /)

  function updateDisplay() {
    display.textContent = expr === '' ? '0' : expr;
  }

  function append(value) {
    // Prevent two operators in a row (basic)
    const last = expr.slice(-1);
    if (isOperator(value)) {
      if (expr === '' && value !== '-') return; // only allow leading minus
      if (isOperator(last)) {
        // replace last operator with new one
        expr = expr.slice(0, -1) + value;
        updateDisplay();
        return;
      }
    }
    expr += value;
    updateDisplay();
  }

  function isOperator(ch) {
    return ['+', '-', '*', '/'].includes(ch);
  }

  function clearAll() {
    expr = '';
    updateDisplay();
  }

  function deleteLast() {
    expr = expr.slice(0, -1);
    updateDisplay();
  }

  function calculate() {
    if (expr.trim() === '') return;
    // Basic input validation: only digits, operators, dot, parentheses, and spaces allowed
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
      display.textContent = 'ERROR';
      expr = '';
      return;
    }
    try {
      // Evaluate safely-ish using Function constructor
      // (still not suitable for untrusted input in a public setting)
      const result = Function('"use strict"; return (' + expr + ')')();
      // Format result: trim trailing .0
      expr = (Number.isFinite(result)) ? String(result) : '';
      updateDisplay();
    } catch (e) {
      display.textContent = 'ERROR';
      expr = '';
    }
  }

  // Attach button handlers
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.getAttribute('data-value');
      const action = btn.getAttribute('data-action');
      if (action === 'clear') clearAll();
      else if (action === 'delete') deleteLast();
      else if (action === 'calculate') calculate();
      else if (v) append(v);
    });
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    const key = e.key;
    if ((/^[0-9]$/).test(key)) append(key);
    else if (['+', '-', '*', '/', '.', '(', ')'].includes(key)) append(key);
    else if (key === 'Enter') { e.preventDefault(); calculate(); }
    else if (key === 'Backspace') { e.preventDefault(); deleteLast(); }
    else if (key === 'Escape') { e.preventDefault(); clearAll(); }
  });

  updateDisplay();
});