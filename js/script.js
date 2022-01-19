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

  // update display
  // get all UI elements
  const calcStateUI = document.querySelector('.calc-state');
  const calc = document.querySelector('.js-calc');
  const displayLine = calc.querySelector('.display-line--bottom');
  const displayLineResult = calc.querySelector('.display-line--top');

  // set some state
  let state = {
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

  function doOperation(operator, a, b, printChar) {
    const result = operate(operator, a, b);
    console.log({ result });
    state.a = result;
    state.b = '';
    state.operator = operator;
    state.result = result;
    state.ui.value = '';
    if (printChar) {
      state.ui.result = result + printChar;
    } else {
      state.ui.result = result;
    }
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
    } else {
      ui.value += value;
    }
  }

  function processOperatorKey(operator) {
    const { result, ui } = state;

    if (result && !ui.value) {
      state.operator = operator;
      // check if the last el is operator.
      if (typeof ui.result === 'number') {
        ui.result += state.operator;
      } else {
        ui.result = ui.result.slice(0, -1) + operator;
      }
    }

    if (operator === '-' && ui.value.length === 0 && !result) {
      ui.value += operator;
      return;
    }

    if (state.a && ui.value) {
      // prev operator
      doOperation(state.operator, state.a, Number(ui.value), operator);
      state.operator = operator;
      updateUI();
      // print
      return;
    }

    state.operator = operator;

    if (!state.a) {
      state.a = Number(ui.value);
      ui.result = state.a + operator;
      ui.value = '';
    } else if (ui.value.length > 0) {
      state.b = Number(ui.value);
      doOperation(operator, state.a, state.b);
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
        const { operator: op, a, b, ui } = state;

        if (!a || !ui.value) return;
        if (!b) state.b = Number(ui.value);

        doOperation(op, a, state.b, true);
        updateUI();
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
