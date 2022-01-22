'use strict';

(function () {
  const printKeys = {
    '+': '&plus;',
    '-': '&#45;', // short minus
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

  const calc = document.querySelector('.js-calc');
  const displayLine = calc.querySelector('.display-line--bottom');
  const displayLineResult = calc.querySelector('.display-line--top');

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

  function updateUI() {
    const { ui } = state;

    displayLine.textContent = ui.value;
    displayLineResult.innerHTML = ui.result;
  }

  function tryCalculation() {
    const { math, ui } = state;

    if (math.operator && ui.value) {
      math.b = ui.value;
      console.log(`Try calculate ${math.a} ${math.operator} ${math.b}`);
      let result = operate(math.operator, math.a, math.b);

      if (Math.abs(result) === Infinity || Number.isNaN(result)) {
        clearState('Error');
        return;
      }

      result = Math.round(result * 1000) / 1000;

      if (String(result).length > 13) {
        clearState('Overflow');
        return;
      }

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

  function processValueKey(value) {
    const { ui } = state;

    if (ui.value.length >= 13) return;

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

    if (operator === 'Delete') {
      clearState();
      return;
    }

    if (operator === 'Backspace') {
      ui.value = ui.value.slice(0, -1);
      if (!ui.value || ui.value === '-') ui.value = '0';
      return;
    }

    tryCalculation();

    // Avoid rewrite operator on 'Enter' or '='
    if (operator === 'Enter' || operator === '=') return;

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

  function processKey(ui, value, operator) {
    if (ui.value === 'Error' || ui.value === 'Overflow') clearState();

    if (operator) processOperatorKey(operator);
    if (value) processValueKey(value);

    updateUI();
  }

  const calcKeys = calc.querySelectorAll('.calc-key');
  calcKeys.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const { value, operator } = e.target.dataset;
      processKey(state.ui, value, operator);
    });
  });

  // keyboard support
  const allowedValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
  const allowedOperators = ['+', '-', '*', '/', '=', 'Backspace', 'Enter', 'Delete'];

  document.addEventListener('keydown', (e) => {
    const { key } = e;
    let value;
    let operator;

    if (allowedValues.indexOf(key) !== -1) {
      value = key;
    } else if (allowedOperators.indexOf(key) !== -1) {
      operator = key;
    }

    processKey(state.ui, value, operator);
  });

  // init actions
  updateUI();
})();
