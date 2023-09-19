export const calculateMortgageData = (loanAmount, loanInterestRate, loanTenure) => {
    const principal = loanAmount;
    const annualInterestRate = loanInterestRate / 100;
    const monthlyInterestRate = annualInterestRate / 12;
    const tenureMonths = loanTenure;
  
    const monthlyRepayment =
      (principal *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, tenureMonths)) /
      (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);
  
    const interestRepayment = principal * (Math.pow((1 + annualInterestRate), 1/12) - 1)
  
    return { monthlyRepayment, interestRepayment };
  };