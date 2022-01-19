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
  const operate = (operator, a, b) => pickOperation(operator)(Number(a), Number(b));

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
  let state = {
    val: '',
    a: '',
    b: '',
    operator: '',
    result: '',
    ui: {
      value: '',
      result: '',
    },
  };

  function clearState() {
    state = {
      val: '',
      a: '',
      b: '',
      operator: '',
      result: '',
      ui: {
        value: '',
        result: '',
      },
    };
  }

  // update state on operations
  // update UI after operations
  function updateUI() {
    const { ui } = state;

    displayLine.textContent = ui.value;
    displayLineResult.textContent = ui.result;
    calcStateUI.textContent = JSON.stringify(state, null, 2);
  }

  function doOperation(operator, a, b) {
    const result = operate(operator, a, b);
    clearState();
    state.a = result;
    state.operator = operator;
    state.result = result;
    state.ui.result = result;
  }

  // add keypress events somehow

  function processValueKey(value) {
    const { ui } = state;

    if (value === '.') {
      if (ui.value.indexOf('.') === -1) {
        if (ui.value.length === 0 || (ui.value.length === 1 && ui.value.slice(0, 1) === '-')) {
          ui.value += '0.';
        } else {
          ui.value += '.';
        }
      }
      return;
    }

    ui.value += value;
  }

  function processOperatorKey(operator) {
    const { ui } = state;

    if (ui.value.length === 0 && operator === '-') {
      ui.value += operator;
    } else {
      console.log('do action');
    }
  }

  const calcKeys = calc.querySelectorAll('.calc-key');
  calcKeys.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const { value, operator } = e.target.dataset;

      if (operator === 'clear') {
        clearState();
        updateUI();
        return;
      }

      if (operator === '=') {
        if (state.a && state.b) {
          doOperation(state.operator, state.b, state.a);
          state.operator = '';
          updateUI();
        }
        return;
      }

      if (operator) processOperatorKey(operator);
      if (value) processValueKey(value);

      updateUI();
    });
  });

  // init actions
  updateUI();
})();
