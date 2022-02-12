const digits = {
  Z: 2000,
  M: 1000,
  CM: 900,
  D: 500,
  CD: 400,
  C: 100,
  XC: 90,
  L: 50,
  XL: 40,
  X: 10,
  IX: 9,
  V: 5,
  IV: 4,
  I: 1,
};

function roman2arabic(str) {
  if (!/^[IVXLCDMZ]+$/i.test(str))
    throw new Error("Incorrect roman number format: " + str);
  return str
    .toUpperCase()
    .split("")
    .reduce(function (r, v, i, arr) {
      const [a, b, c] = [
        digits[arr[i]],
        digits[arr[i + 1]],
        digits[arr[i + 2]],
      ];
      if (b && c && a <= b && b < c)
        throw new Error("Incorrect roman number format: " + str);
      return b > a ? r - a : r + a;
    }, 0);
}

function arabic2roman(num) {
  if (!/^\-?\d+$/.test(num + ""))
    throw new Error("Can`t convert that arabic numeric to roman: " + num);
  if (num < 1) return ""; // Поскольку в римской системе счисления нет нуля и отрицательных чисел, то вместо них возвращаем пустую строку
  let result = "";
  for (let key in digits)
    while (num >= digits[key]) {
      result += key;
      num -= digits[key];
    }
  return result;
}

function calculator(str) {
  // Удаляем пробелы из строки
  let badChars = [];
  str = str.replace(/[^IVXLCDMZ\d+\-*\/]/gi, (chr) => {
    if (chr !== " ") badChars.push(chr);
    return "";
  });
  if (badChars.length > 0)
    throw Error("Символы не допустимы: " + badChars.join(" ")); //если не допустимый символ то тогда выдаем ошибку
  let isRoman = /^[IVXLCDMZ]+$/i;
  let vars = str.split(/[+\-*\/]/g); //получаем цифры
  let action = "";
  if (vars.length === 2) {
    action = str.match(/[+\-*\/]/)[0]; //Узнаем какую операцию выполнить
  } else if (vars.length < 2) {
    throw Error("строка не является математической операцией: " + vars);
  }
  let isArabic = /^[0-9]+$/i;
  if (vars.length > 2) throw Error("Должно быть лишь два операнда");
  // Проверяем что операнда одна
  // Проверяем что операнда одна

  let r = vars.reduce((s, v) => s + isRoman.test(v), 0); // Получаем кол. римских чисел
  // если кол. римских символов равна единицу то выдаем ошибку
  if (r === 1) {
    throw Error(
      "Оба числа должны быть либо римскими, либо арабскими, исправьте выражение: " +
        str
    );
  } else if (r === 2) vars = vars.map((v) => roman2arabic(v));
  // функция возвращает нам разделив число по отдельности
  else if (vars.reduce((s, v) => s + /^\d+$/.test(v)) < 2)
    throw Error(
      "Приведенные операнды не допустимы, проверьте выражение: " + str
    );
  // Проверяем, если один из чисел больше 10 или меньше 0 то выдаем ошибку
  if (vars.some((v) => v < 1 || v > 10))
    throw Error("Допустимо значение операндов лишь от 1 до 10 включительно");
  let result = Math.floor(eval(vars.join(action))); // округляем число (eval выполняет JS код,представленный строкой.)
  return r === 0 ? result.toString() : arabic2roman(result); // если числа арабские то возврощаем результат в арабских числах если в римском то в римском
}

// console.log(calculator("2+2"));
// console.log(calculator("VI / III"));
// console.log(calculator("VII / III"));
// console.log(calculator("I + II"));
// console.log(calculator("I - II"));
// console.log(calculator("I + 1"));
// console.log(calculator("I"));
// console.log(calculator("1 + 1 + 1"));
