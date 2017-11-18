// Creating an app object
const app = {};

app.hstRate = .13;
app.form = $('.invoice');
app.addRow = $('.js-add-row');
app.deleteRow = $('.js-delete-row');
app.invoiceBody = $('.js-invoice-body');
app.subTotal = $('.js-subtotal');
app.total = $('.js-total');
app.paid = $('.js-paid');
app.balanceTotal = $('.js-balance');

app.init = () => {

  app.form.on('submit', function(e){
    e.preventDefault();
  });

  app.addRow.click(function(){
    const newRow = `<tr class="item-row"><td class="js-delete-row"><span class="delete-icon" title="Remove row"><svg class="custom-icon-trash-o"><use xlink:href="#custom-icon-trash-o"></use></svg></span></td><td class="item-name"><textarea placeholder="Task/Item Name"></textarea></td><td class="description"> <textarea placeholder="Description"></textarea> </td><td> <input class="input-width rate" type="number" value="0.00"></td><td> <input class="input-width qty" type="number" value="0"> </td><td> <span class="line-total">0.00</span> </td></tr>`;

    $('.js-invoice-body').append(newRow);
  });

  $('.js-invoice-body').on('click', '.js-delete-row',
  function(){
    $(this).parent().remove();
  });

  $('.js-invoice-body').on( 'click', 'input[type="number"]',
    function( event ) {
      $(this).blur(app.updateLineTotal);
  });

  $('.paid').blur(app.updateBalance);

  $('.js-print').on('click', function(e){
    e.preventDefault();
    window.print()
  });

}

app.updateLineTotal = function() {
  const row = $(this).closest('tr'); // target current row
  const rate = row.find('.rate').val();
  const qty = row.find('.qty').val();
  let lineTotal = parseFloat(rate, 10) * parseInt(qty, 10);

  lineTotal = lineTotal.toFixed(2);
  row.find('.line-total').text(lineTotal);

  app.updateTotals();
}

app.calculateTax = (price) => {
  const hst = 0.13;
  const taxTotal = hst * price;
  return taxTotal;
}

app.updateTotals = () => {
  let subTotal = 0;

  $('.line-total').each(function(i){
    let lineTotal = $(this).text();
    if (!isNaN(lineTotal)) subTotal += parseFloat(lineTotal, 10);
  });

  subTotal = app.getRoundNumber(subTotal, 2);
  app.subTotal.text(subTotal);

  let tax = app.calculateTax(subTotal);
  let total = parseFloat(subTotal) + tax;

  total = app.getRoundNumber(total, 2);
  tax = app.getRoundNumber(tax, 2);

  app.total.text(total);
  $('.js-tax').text(tax);

  app.updateBalance();
}

app.updateBalance = () => {
  let balance = parseFloat(app.total.text()) - parseInt(app.paid.val());
  balance = app.getRoundNumber(balance, 2);
  app.balanceTotal.text(balance);
}

// from http://www.mediacollege.com/internet/javascript/number/round.html
app.getRoundNumber = (number,decimals) => {
  var newString;// The new rounded number
  decimals = Number(decimals);
  if (decimals < 1) {
    newString = (Math.round(number)).toString();
  } else {
    var numString = number.toString();
    if (numString.lastIndexOf('.') == -1) {// If there is no decimal point
      numString += '.';// give it one at the end
    }
    var cutoff = numString.lastIndexOf('.') + decimals;// The point at which to truncate the number
    var d1 = Number(numString.substring(cutoff,cutoff+1));// The value of the last decimal place that we'll end up with
    var d2 = Number(numString.substring(cutoff+1,cutoff+2));// The next decimal, after the last one we want
    if (d2 >= 5) {// Do we need to round up at all? If not, the string will just be truncated
      if (d1 == 9 && cutoff > 0) {// If the last digit is 9, find a new cutoff point
        while (cutoff > 0 && (d1 == 9 || isNaN(d1))) {
          if (d1 != '.') {
            cutoff -= 1;
            d1 = Number(numString.substring(cutoff,cutoff+1));
          } else {
            cutoff -= 1;
          }
        }
      }
      d1 += 1;
    }
    if (d1 == 10) {
      numString = numString.substring(0, numString.lastIndexOf('.'));
      var roundedNum = Number(numString) + 1;
      newString = roundedNum.toString() + '.';
    } else {
      newString = numString.substring(0,cutoff) + d1.toString();
    }
  }
  if (newString.lastIndexOf('.') == -1) {// Do this again, to the new string
    newString += '.';
  }
  var decs = (newString.substring(newString.lastIndexOf('.')+1)).length;
  for(var i=0;i<decimals-decs;i++) newString += '0';
  //var newNumber = Number(newString);// make it a number if you like
  return newString; // Output the result to the form field (change for your purposes)
}

$(function() {
  app.init();
});
