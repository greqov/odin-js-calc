'use strict';

(function () {
  const printKeys = {
    '+': '&plus;',
    '-': '&minus;',
    '*': '&times;',
    '/': '&divide;',
  };

  const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
  };

  const operate = (operator, a, b) => operations[operator](Number(a), Number(b));

  // update display
  // get all UI elements
  const calcStateUI = document.querySelector('.calc-state');
  const calc = document.querySelector('.js-calc');
  const displayLine = calc.querySelector('.display-line--bottom');
  const displayLineResult = calc.querySelector('.display-line--top');

  // set some state
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

  function clearState(message) {
    state = {
      math: {
        a: 0,
        b: '',
        operator: '',
      },
      ui: {
        result: '',
        value: message || '0',
      },
    };
  }

  // update state on operations
  // update UI after operations
  function updateUI() {
    const { ui } = state;

    displayLine.textContent = ui.value;
    displayLineResult.innerHTML = ui.result;
    calcStateUI.textContent = JSON.stringify(state, null, 2);
  }

  // add keypress events somehow

  function processValueKey(value) {
    const { ui } = state;

    if (value === '.') {
      if (ui.value.indexOf('.') === -1) {
        if (ui.value === '') {
          ui.value += '0.';
        } else {
          ui.value += '.';
        }
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

    if (operator === 'clear') {
      clearState();
      return;
    }

    if (operator === 'del') {
      ui.value = ui.value.slice(0, -1);
      if (!ui.value || ui.value === '-') ui.value = '0';
      return;
    }

    function tryCalculation() {
      if (math.operator && ui.value) {
        math.b = ui.value;
        console.log(`Try calculate ${math.a} ${math.operator} ${math.b}`);
        const result = operate(math.operator, math.a, math.b);

        if (Math.abs(result) === Infinity || Number.isNaN(result)) {
          clearState('Error');
        } else {
          // update state
          math.a = result;
          math.b = '';
          math.operator = '';
          ui.result = '';
          ui.value = String(result);
        }
      } else {
        console.log('Not enough data to perform calculation');
      }
    }

    tryCalculation();

    // Avoid rewrite operator to '='
    if (operator === '=') return;

    math.operator = operator;

    if (!ui.value) {
      // remove prev operator in result line
      if (ui.result.indexOf('&') !== -1) {
        ui.result = parseFloat(ui.result);
      }

      ui.result += printKeys[math.operator];
    } else {
      math.a = Number(ui.value);
      ui.value = '';
      ui.result = math.a + printKeys[math.operator];
    }
  }

  const calcKeys = calc.querySelectorAll('.calc-key');
  calcKeys.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const { value, operator } = e.target.dataset;

      if (state.ui.value === 'Error') clearState();

      if (operator) processOperatorKey(operator);
      if (value) processValueKey(value);

      updateUI();
    });
  });

  // init actions
  updateUI();
})();
