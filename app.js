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

  // Data Structure
  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
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
    expensesContainer: '.expenses__list'
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
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
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMStrings.expensesContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
  };

  const ctrlAddItem = function() {
    /**
     * @TODO - Add item to budgetController
     * @TODO - Add item to UI
     * @TODO - Calculate AND Display Budget
     */
    let input = UICtrl.getInput();

    let newItem = budgetController.addItem(
      input.type,
      input.description,
      input.value
    );

    UICtrl.addListItem(newItem, input.type);
  };

  return {
    init: function() {
      console.log('App has Started o/');
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();
