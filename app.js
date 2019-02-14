// <==== BUDGET CONTROLLER ====>
const budgetController = (function() {
  /**
   *
   * @param {String} id - item id
   * @param {String} description - description of the transaction
   * @param {Number} value - amount of money
   */
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  /**
   * @method calcPercentage() -
   * calculate Income Percentage
   * @param {number} totalIncome - sum of all Income
   */
  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  /**
   * @method getPercentage() -
   * retrieve the percentage value from the Expense constructor object
   */
  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  /**
   *
   * @param {String} id - item id
   * @param {String} description - description of the transaction
   * @param {Number} value - amount of money
   */
  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  /**
   * @function calculateTotal(type) -
   * calculate the total of either expenses or income
   * @param {string} type - expenses Or income
   */
  const calculateTotal = function(type) {
    let sum = 0;
    data.allItems[type].forEach(function(item) {
      sum = sum + item.value;
    });
    data.totals[type] = sum;
  };

  // Data Structure
  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    /**
     *
     * @param {String} type - income or expense
     * @param {String} des  - description
     * @param {Number} value - amount of money
     */
    addItem: function(type, des, val) {
      let newItem, ID;
      // Create new id, check the last element and add one
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      data.allItems[type].push(newItem);
      return newItem;
    },
    /**
     * @method deleteItem(type,id) -
     * delete budget item by item ID
     * @param {string} type - income or expense
     * @param {number} id - item Id
     */
    deleteItem: function(type, id) {
      let items, index;

      items = data.allItems[type].map(function(item) {
        return item.id;
      });
      index = items.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    /**
     * @method  calculateBudget() -
     * calculate the whole budget with income and expenses,
     * calculate the percentage of income spent
     */
    calculateBudget: function() {
      calculateTotal('exp');
      calculateTotal('inc');

      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
      data.budget = data.totals.inc - data.totals.exp;
    },
    /**
     * @method calculatePercentages() -
     * calculate income and expense percentages
     */
    calculatePercentages: function() {
      data.allItems.exp.forEach(function(item) {
        item.calcPercentage(data.totals.inc);
      });
    },
    /**
     * @method getPercentages() -
     * get the calculated percentages,
     * map through the results
     */
    getPercentages: function() {
      let allPercentages = data.allItems.exp.map(function(item) {
        return item.getPercentage();
      });
      return allPercentages;
    },
    /**
     * @method getBudget() -
     * return budget total income. expenses and percentage
     */
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },
    testing: function() {
      console.log(data);
    }
  };
})();

// <==== UI CONTROLLER ====>
const UIController = (function() {
  let DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercentageLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  /**
   * @function formatNumber(num,type) =
   * format numbers for better display
   * @param {number} num - number value
   * @param {string} type - expense or income
   */
  const formatNumber = function(num, type) {
    let splitNumber, int, dec, sign;
    number = Math.abs(num);
    number = number.toFixed(2);
    splitNumber = number.split('.');
    int = splitNumber[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }

    dec = splitNumber[1];

    return (
      (type === 'exp' ? (sign = '-') : (sign = '+')) + ' ' + int + '.' + dec
    );
  };

  /**
   * @function nodeListForEach(list,callback) -
   * loop through the html node elements and
   * display the calculated percentages
   * @param {array} list - html node elements
   * @param {function} callback - callback function
   * to loop through the nodes
   */
  let nodeListForEach = function(list, callback) {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    },
    /**
     *
     * @param {object} obj - input data
     * @param {string} type - income or expense
     * Create HTML string with placeholder text
     * Replace the placeholder text with data
     * Insert HTML into the DOM
     */
    addListItem: function(obj, type) {
      let html, newHtml, element;
      if (type === 'inc') {
        element = DOMStrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMStrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    /**
     * @method deleteListItem(id) -
     * delete item and update DOM
     * @param {string} id - item type and id class
     */
    deleteListItem: function(id) {
      let item = document.getElementById(id);
      item.parentNode.removeChild(item);
    },
    clearFields: function() {
      let inputFields = document.querySelectorAll(
        DOMStrings.inputDescription + ', ' + DOMStrings.inputValue
      );

      let fieldsArray = Array.prototype.slice.call(inputFields);

      fieldsArray.forEach(function(currentValue, index, array) {
        currentValue.value = '';
      });
      fieldsArray[0].focus();
    },
    /**
     * @method displayBudget(obj) -
     * display the budget on the page
     * @param {object} obj -
     * budget,income,expenses,percentage
     */
    displayBudget: function(obj) {
      let type;
      obj.budget > 0 ? (type = 'inc') : 'exp';
      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        'inc'
      );
      document.querySelector(
        DOMStrings.expensesLabel
      ).textContent = formatNumber(obj.totalExp, 'exp');

      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent =
          obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = '---';
      }
    },
    /**
     * @method displayPercentages(percentages) -
     * render the calculated percentages to the UI
     * @param {array} percentages -
     * the calculated percentages array
     */
    displayPercentages: function(percentages) {
      let fields = document.querySelectorAll(
        DOMStrings.expensesPercentageLabel
      );
      nodeListForEach(fields, function(value, index) {
        if (percentages[index] > 0) {
          value.textContent = percentages[index] + '%';
        } else {
          value.textContent = '---';
        }
      });
    },
    /**
     * @method displayMonth() - display current month
     */
    displayMonth: function() {
      let now, year, month, months;
      now = new Date();
      year = now.getFullYear();
      months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];
      month = now.getMonth();
      document.querySelector(DOMStrings.dateLabel).textContent =
        months[month] + ' ' + year;
    },
    /**
     * @method changedType() - change Input color
     * depending on income or expense
     */
    changedType: function() {
      let fields = document.querySelectorAll(
        `${DOMStrings.inputType},
        ${DOMStrings.inputDescription}, 
        ${DOMStrings.inputValue}`
      );
      nodeListForEach(fields, function(item) {
        item.classList.toggle('red-focus');
      });
      document.querySelector(DOMStrings.inputButton).classList.toggle('red');
    },
    getDOMStrings: function() {
      return DOMStrings;
    }
  };
})();

// <==== GLOBAL CONTROLLER ====>
/**
 * @param {Function} budgetCtrl - budget Controller
 * @param {Function} UICtrl - UI Controller
 * @param {Function} ctrlAddItem - Add item method
 */
const controller = (function(budgetCtrl, UICtrl) {
  const setupEventListeners = function() {
    let DOM = UICtrl.getDOMStrings();

    document
      .querySelector(DOM.inputButton)
      .addEventListener('click', ctrlAddItem);
    /**
     *  Add global Event Listener for the Return Key
     * @param {Object} event - keyboard key press
     */
    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.container)
      .addEventListener('click', ctrlDeleteItem);

    document
      .querySelector(DOM.inputType)
      .addEventListener('change', UICtrl.changedType);
  };

  /**
   * @function updateBudget() - calculate budget,
   * return budget and Display the budget on the UI
   */
  const updateBudget = function() {
    budgetCtrl.calculateBudget();
    const budget = budgetCtrl.getBudget();
    UICtrl.displayBudget(budget);
  };
  /**
   * @function updatePercentages() -
   * calculate percentages,
   * Read percentages from budget controller
   * Update the UI
   */
  const updatePercentages = function() {
    budgetCtrl.calculatePercentages();
    let percentages = budgetCtrl.getPercentages();
    UICtrl.displayPercentages(percentages);
  };

  const ctrlAddItem = function() {
    /**
     * @method getInput - Get input values
     * @method addItem - Add item to budgetController
     * @method addListItem - Add item to UI
     * @method clearFields - Clear Input Fields
     */
    let input = UICtrl.getInput();
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      let newItem = budgetController.addItem(
        input.type,
        input.description,
        input.value
      );

      UICtrl.addListItem(newItem, input.type);
      UICtrl.clearFields();
      updateBudget();
      updatePercentages();
    }
  };

  /**
   * @function ctrlDeleteItem(event) - delete budget item
   * @param {string} event = click event, target element
   * use parentNode until item ID
   */
  const ctrlDeleteItem = function(event) {
    let itemId;
    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemId) {
      let splitId = itemId.split('-');
      let type = splitId[0];
      let id = parseInt(splitId[1]);

      budgetCtrl.deleteItem(type, id);
      UICtrl.deleteListItem(itemId);

      updateBudget();
      updatePercentages();
    }
  };

  return {
    init: function() {
      console.log('App has Started o/');
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();
