// <==== BUDGET CONTROLLER ====>
const budgetController = (function() {
  // Code4US
})();

// <==== UI CONTROLLER ====>
const UIController = (function() {
  let DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn'
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      };
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
  };

  return {
    init: function() {
      console.log('App has Started /o/ dab');
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();
