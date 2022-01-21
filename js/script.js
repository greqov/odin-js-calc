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
      a: 0,
      b: '',
      operator: '',
    },
    ui: {
      result: '',
      value: '0',
    },
  };

  function clearState() {
    state = {
      math: {
        a: 0,
        b: '',
        operator: '',
      },
      ui: {
        result: '',
        value: '0',
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
        ui.value += '.';
      }
      return;
    }

    if (ui.value === '0') {
      ui.value = value;
    } else {
      ui.value += value;
    }
  }

  function processOperatorKey(operator) {
    const { math, ui } = state;

    function tryCalculation() {
      if (math.operator && ui.value) {
        // TODO: check if ui.result contains operator!
        math.b = ui.value;
        console.log(`Try calculate ${math.a} ${math.operator} ${math.b}`);
        const result = operate(math.operator, math.a, math.b);

        // update state
        math.a = result;
        math.b = '';
        math.operator = '';
        ui.result = '';
        ui.value = String(result);
      } else {
        console.log('Not enough data to perform calculation');
      }
    }

    tryCalculation();

    // Avoid rewrite operator to '='
    if (operator === '=') return;

    math.operator = operator;

    if (!ui.value) {
      // fix multiple operators in result line
      if (['+', '-', '*', '/'].includes(ui.result.slice(-1))) {
        ui.result = ui.result.slice(0, -1);
      }

      ui.result += math.operator;
    } else {
      math.a = Number(ui.value);
      ui.value = '';
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
