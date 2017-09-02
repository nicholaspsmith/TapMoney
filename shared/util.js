import Money from 'money-works';

export const midas = amt => {
  return new Money(amt, 'USD').toString();
}