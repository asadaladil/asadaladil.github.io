/**
         * The Calculator class handles all the logic and state.
         */
        class Calculator {
            constructor(previousOperandTextElement, currentOperandTextElement) {
                this.previousOperandTextElement = previousOperandTextElement;
                this.currentOperandTextElement = currentOperandTextElement;
                this.clear(); // Set default values on startup
            }

            // Resets the calculator to its default state
            clear() {
                this.currentOperand = '0';
                this.previousOperand = '';
                this.operation = undefined;
                this.readyToReset = false; // Used to clear display after '='
            }

            // Appends a number or decimal point to the current number
            appendNumber(number) {
                // Prevent multiple decimal points
                if (number === '.' && this.currentOperand.includes('.')) return;
                // If we just hit equals, start a new number
                if (this.readyToReset) {
                    this.currentOperand = number;
                    this.readyToReset = false;
                    return;
                }
                // Handle starting with 0
                if (this.currentOperand === '0' && number !== '.') {
                    this.currentOperand = number;
                } else {
                    this.currentOperand = this.currentOperand.toString() + number.toString();
                }
            }

            // Handles the "AC", "+/-", and "%" buttons
            handleFunction(func) {
                switch (func) {
                    case 'ac':
                        this.clear();
                        break;
                    case 'toggle':
                        if (this.currentOperand === '0') return;
                        this.currentOperand = this.currentOperand * -1;
                        break;
                    case 'percent':
                        this.currentOperand = this.currentOperand / 100;
                        break;
                }
            }

            // Sets the chosen operation (+, -, etc.)
            chooseOperation(operation) {
                if (this.currentOperand === '') return;
                // If we have a pending operation, compute it first
                if (this.previousOperand !== '') {
                    this.compute();
                }
                
                this.operation = operation;
                this.previousOperand = this.currentOperand;
                this.currentOperand = '';
            }

            // Performs the calculation
            compute() {
                let computation;
                const prev = parseFloat(this.previousOperand);
                const current = parseFloat(this.currentOperand);

                if (isNaN(prev) || isNaN(current)) return;

                switch (this.operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '-':
                        computation = prev - current;
                        break;
                    case '×':
                        computation = prev * current;
                        break;
                    case '÷':
                        if (current === 0) {
                            alert("Cannot divide by zero!");
                            this.clear();
                            return;
                        }
                        computation = prev / current;
                        break;
                    default:
                        return; // No operation
                }
                
                this.currentOperand = computation;
                this.operation = undefined;
                this.previousOperand = '';
                this.readyToReset = true; // Flag to reset on next number press
            }

            // Formats numbers with commas for readability
            getDisplayNumber(number) {
                const stringNumber = number.toString();
                const integerDigits = parseFloat(stringNumber.split('.')[0]);
                const decimalDigits = stringNumber.split('.')[1];
                
                let integerDisplay;
                if (isNaN(integerDigits)) {
                    integerDisplay = '';
                } else {
                    integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
                }
                
                if (decimalDigits != null) {
                    return `${integerDisplay}.${decimalDigits}`;
                } else {
                    return integerDisplay;
                }
            }

            // Updates the text on the display screen
            updateDisplay() {
                this.currentOperandTextElement.innerText = 
                    this.getDisplayNumber(this.currentOperand);
                
                if (this.operation != null) {
                    this.previousOperandTextElement.innerText = 
                        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
                } else {
                    this.previousOperandTextElement.innerText = '';
                }
            }
        }

        
        /**
         * Event Listeners: Connect the HTML buttons to the Calculator class
         */

        // Select all buttons and display elements
        const numberButtons = document.querySelectorAll('[data-number]');
        const operationButtons = document.querySelectorAll('[data-operation]');
        const functionButtons = document.querySelectorAll('[data-function]');
        const equalsButton = document.querySelector('[data-equals]');
        const previousOperandTextElement = document.querySelector('[data-previous-operand]');
        const currentOperandTextElement = document.querySelector('[data-current-operand]');

        // Create a new calculator instance
        const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

        // Add click event listener for number buttons (0-9, .)
        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                // If no text, use the 'data-number' attribute (for '0' button)
                const number = button.innerText || button.dataset.number;
                calculator.appendNumber(number);
                calculator.updateDisplay();
            });
        });

        // Add click event listener for function buttons (AC, +/-, %)
        functionButtons.forEach(button => {
            button.addEventListener('click', () => {
                calculator.handleFunction(button.dataset.function);
                calculator.updateDisplay();
            });
        });

        // Add click event listener for operation buttons (+, -, ×, ÷)
        operationButtons.forEach(button => {
            button.addEventListener('click', () => {
                calculator.chooseOperation(button.dataset.operation);
                calculator.updateDisplay();
            });
        });

        // Add click event listener for the equals button
        equalsButton.addEventListener('click', () => {
            calculator.compute();
            calculator.updateDisplay();
        });

        // Initialize the display on page load
        calculator.updateDisplay();