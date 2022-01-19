'use strict';

(function () {
  // basic math operations
  const sum = (a, b) => a + b;
  const substr = (a, b) => a - b;
  const divide = (a, b) => a / b;
  const multiply = (a, b) => a * b;

  const operations = {
    '+': sum,
    '-': substr,
    '*': multiply,
    '/': divide,
  };

  const pickOperation = (operator) => operations[operator];
  const operate = (operator, a, b) => pickOperation(operator)(a, b);

  operate('+', 1, 2);

  document.addEventListener('keypress', (e) => {
    console.log(e.key);
  });

  // update display
  // get all UI elements
  const calcStateUI = document.querySelector('.calc-state');
  const calc = document.querySelector('.js-calc');
  const displayLine = calc.querySelector('.display-line--bottom');
  const displayLineResult = calc.querySelector('.display-line--top');
  // set some state
  const state = {
    line: '',
    lineResult: '',
    operator: '',
  };
  // update state on operations
  // update UI after operations
  function updateUI() {
    displayLine.textContent = state.line;
    displayLineResult.textContent = state.lineResult;
    calcStateUI.textContent = JSON.stringify(state);
  }

  updateUI();

  function doOperation(operator, a, b) {
    const result = operate(operator, a, b);
    state.result = result;
    state.lineResult = result; // why?
    state.line = '_';
    updateUI();
  }

  doOperation('+', 4, 3);

  // add keypress events somehow

  const calcKeys = calc.querySelectorAll('.calc-key');
  calcKeys.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const { value, operator } = e.target.dataset;

      if (operator) state.operator = operator;
      if (value) state.value = value;

      updateUI();
    });
  });

})();
