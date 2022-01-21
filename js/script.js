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

  // update display
  // get all UI elements
  const calcStateUI = document.querySelector('.calc-state');
  const calc = document.querySelector('.js-calc');
  const displayLine = calc.querySelector('.display-line--bottom');
  const displayLineResult = calc.querySelector('.display-line--top');

  // set some state
  // TODO: simplify state?
  let state = {
    math: {
      a: '',
      b: '',
      operator: '',
    },
    ui: {
      result: '',
      value: '',
    },
  };

  function clearState() {
    state = {
      math: {
        a: '',
        b: '',
        operator: '',
      },
      ui: {
        result: '',
        value: '',
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
    const { math, ui } = state;

    function performCalcActions() {
      console.log('performCalcActions');
      // TODO: check if ui.result contains operator!
      math.b = ui.value;
      const result = operate(math.operator, math.a, math.b);

      // update state
      math.a = result;
      math.b = '';
      ui.result = result;
      ui.value = '';
    }

    if (operator === '=') {
      if (math.a && math.operator && ui.value) {
        performCalcActions();
      } else {
        console.log('Not enough data to perform calculation');
      }
      return;
    }

    if (math.a && math.operator && ui.value) performCalcActions();

    math.operator = operator;

    // TODO: replace the last operator in ui.result

    if (math.a && !ui.value) {
      ui.result += math.operator;
      return;
    }

    if (!math.a) {
      math.a = ui.value;
      ui.value = '';
      // check
      ui.result = math.a + math.operator;
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

      if (operator) processOperatorKey(operator);
      if (value) processValueKey(value);

      updateUI();
    });
  });

  // init actions
  updateUI();
})();
