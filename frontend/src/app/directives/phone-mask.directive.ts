import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appPhoneMask]'
})
export class PhoneMaskDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent) {
    const input = this.el.nativeElement;
    let value = input.value.replace(/\D/g, ''); // Удаляем все нецифровые символы

    // Ограничиваем длину до 11 цифр (для формата +7 (999) 999 99 99)
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    // Форматируем номер
    const formattedValue = this.formatPhoneNumber(value);
    input.value = formattedValue;
  }

  private formatPhoneNumber(value: string): string {
    if (value.length === 0) {
      return '';
    }

    // Начинаем с +7
    let formatted = '+7 ';

    // Добавляем первую введенную цифру
    if (value.length === 1) {
      return formatted + value; // Если введен только один символ, возвращаем +7 и этот символ
    }

    // Добавляем скобки и пробелы в зависимости от длины
    if (value.length > 1) {
      formatted += ` ${value.slice(1, 4)}`; // Код города
    }
    if (value.length >= 4) {
      formatted += ` ${value.slice(4, 7)}`; // Первые три цифры
    }
    if (value.length >= 7) {
      formatted += ` ${value.slice(7, 9)}`; // Следующие две цифры
    }
    if (value.length >= 9) {
      formatted += ` ${value.slice(9, 11)}`; // Последние две цифры
    }

    return formatted.trim(); // Убираем лишние пробелы
  }
}
