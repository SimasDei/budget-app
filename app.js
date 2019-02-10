const budgetController = (function() {
  let x = 23;

  let add = function(a) {
    return x + a;
  };

  return {
    publicTest: function(b) {
      return add(b);
    }
  };
})();

const UIController = (function() {
  // Code goes here
})();

const controller = (function(budgetCtrl, UICtrl) {
  let y = budgetCtrl.publicTest(5);

  return {
    publicTestTwo: function() {
      return y;
    }
  };
})(budgetController, UIController);
