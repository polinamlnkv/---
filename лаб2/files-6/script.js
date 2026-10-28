window.onload = function () {

  // ---------------------------------------------------------------------
  // Шаг 1. Переменные для хранения чисел и операций
  // ---------------------------------------------------------------------
  let a = '';                     // первое число
  let b = '';                     // второе число
  let expressionResult = '';      // результат вычисления
  let selectedOperation = null;   // выбранная операция (+, -, x, /)

  // ---------------------------------------------------------------------
  // Шаг 2. Доступ к элементам калькулятора
  // ---------------------------------------------------------------------
  const outputElement = document.getElementById('result');

  // все кнопки с цифрами и точкой (id начинается с "btn_digit_")
  const digitButtons = document.querySelectorAll('[id^="btn_digit_"]');

  // ---------------------------------------------------------------------
  // Ограничение ввода: не больше MAX_DIGITS "значащих" цифр в числе
  // (минус и точка в счёт не идут — иначе пользователь не успел бы
  // ввести дробное отрицательное число нужной длины)
  // ---------------------------------------------------------------------
  const MAX_DIGITS = 6;

  function countDigits(str) {
    return str.replace('-', '').replace('.', '').length;
  }

  // ---------------------------------------------------------------------
  // Шаг 3. Формирование числа по нажатию цифровой кнопки
  // ---------------------------------------------------------------------
  function onDigitButtonClicked(digit) {
    // пока операция не выбрана — собираем первое число (a)
    if (!selectedOperation) {
      if (digit !== '.' && countDigits(a) >= MAX_DIGITS) return; // лимит достигнут
      if ((digit !== '.') || (digit === '.' && !a.includes(digit))) {
        a += digit;
      }
      outputElement.innerHTML = a;
    }
    // операция уже выбрана — собираем второе число (b)
    else {
      if (digit !== '.' && countDigits(b) >= MAX_DIGITS) return; // лимит достигнут
      if ((digit !== '.') || (digit === '.' && !b.includes(digit))) {
        b += digit;
        outputElement.innerHTML = b;
      }
    }
  }

  // ---------------------------------------------------------------------
  // Шаг 4. Обработчики событий
  // ---------------------------------------------------------------------

  // цифровые кнопки
  digitButtons.forEach(button => {
    button.onclick = function () {
      const digitValue = button.innerHTML;
      onDigitButtonClicked(digitValue);
    };
  });

  // кнопки операций — запоминаем выбор в selectedOperation
  document.getElementById('btn_op_mult').onclick = function () {
    if (a === '') return;
    selectedOperation = 'x';
  };
  document.getElementById('btn_op_plus').onclick = function () {
    if (a === '') return;
    selectedOperation = '+';
  };
  document.getElementById('btn_op_minus').onclick = function () {
    if (a === '') return;
    selectedOperation = '-';
  };
  document.getElementById('btn_op_div').onclick = function () {
    if (a === '') return;
    selectedOperation = '/';
  };

  // ---------------------------------------------------------------------
  // Шаг 5. Кнопка очистки (C)
  // ---------------------------------------------------------------------
  document.getElementById('btn_op_clear').onclick = function () {
    a = '';
    b = '';
    selectedOperation = null;
    expressionResult = '';
    outputElement.innerHTML = 0;
  };

  // ---------------------------------------------------------------------
  // Шаг 6. Кнопка равно (=)
  // ---------------------------------------------------------------------
  document.getElementById('btn_op_equal').onclick = function () {
    if (a === '' || b === '' || !selectedOperation) return;

    switch (selectedOperation) {
      case 'x':
        expressionResult = (+a) * (+b);
        break;
      case '+':
        expressionResult = (+a) + (+b);
        break;
      case '-':
        expressionResult = (+a) - (+b);
        break;
      case '/':
        expressionResult = (+a) / (+b);
        break;
      default:
        break;
    }

    // результат становится новым "первым числом" — можно продолжать счёт
    a = expressionResult.toString();
    b = '';
    selectedOperation = null;
    outputElement.innerHTML = a;
  };

  // ---------------------------------------------------------------------
  // Дополнительно. Кнопка смены знака (+/-)
  // Меняет знак того числа, которое сейчас набирается: a, пока операция
  // не выбрана, либо b — после выбора операции.
  // ---------------------------------------------------------------------
  document.getElementById('btn_op_sign').onclick = function () {
    if (!selectedOperation) {
      if (a === '') return;
      a = a.startsWith('-') ? a.slice(1) : '-' + a;
      outputElement.innerHTML = a;
    } else {
      if (b === '') return;
      b = b.startsWith('-') ? b.slice(1) : '-' + b;
      outputElement.innerHTML = b;
    }
  };

  // ---------------------------------------------------------------------
  // Дополнительно. Кнопка процента (%)
  // Делит текущее набираемое число на 100 (как в большинстве калькуляторов).
  // ---------------------------------------------------------------------
  document.getElementById('btn_op_percent').onclick = function () {
    if (!selectedOperation) {
      if (a === '') return;
      a = ((+a) / 100).toString();
      outputElement.innerHTML = a;
    } else {
      if (b === '') return;
      b = ((+b) / 100).toString();
      outputElement.innerHTML = b;
    }
  };

  // ---------------------------------------------------------------------
  // Собственная функция. Nitro Boost ×2
  // По аналогии с бустами серверов в Discord — удваивает текущее
  // набираемое число и на мгновение "подсвечивает" экран.
  // ---------------------------------------------------------------------
  document.getElementById('btn_op_boost').onclick = function () {
    if (!selectedOperation) {
      if (a === '') return;
      a = ((+a) * 2).toString();
      outputElement.innerHTML = a;
    } else {
      if (b === '') return;
      b = ((+b) * 2).toString();
      outputElement.innerHTML = b;
    }

    // короткая вспышка вокруг экрана
    outputElement.classList.add('boosted');
    setTimeout(() => outputElement.classList.remove('boosted'), 300);
  };

};
