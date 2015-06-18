var Bookshelf = (function ($this){

    function Address(isMailingAddress)
    {
        this.isMailingAddress = ko.observable(isMailingAddress),
        this.fullName = ko.observable('').extend({
            required: {
                          message: 'Please enter your full name.',
                          params: true
            },
            minLength: {
                          message: 'Full name must at least be 2 characters long.',
                          params: 2
            },
        });
        this.addressLineOne = ko.observable('').extend({
            required: {
                          message: 'Please enter address line 1.',
                          params: true
            },
            minLength: {
                          message: 'Address line 1 must at least be 2 characters long.',
                          params: 2
            },
        });
        this.addressLineTwo = ko.observable(''),
        this.city = ko.observable('').extend({
            required: {
                          message: 'Please enter city.',
                          params: true
            },
            minLength: {
                          message: 'City must at least be 2 characters long.',
                          params: 2
            },
        });
        this.stateOrProvince = ko.observable('').extend({
            required: {
                          message: 'Please enter state, province or region.',
                          params: true
            },
            minLength: {
                          message: 'State, province or region must at least be 2 characters long.',
                          params: 2
            },
        });
        this.postalCode = ko.observable('').extend({
            required: true,
            pattern: '[A-Za-z][0-9][A-Za-z] [0-9][A-Za-z][0-9]' 
            //TODO: canadian pattern only for now - see http://html5pattern.com/Postal_Codes for patterns of other countries
        });
       this.country = ko.observable('').extend({
            required: {
                          message: 'Please enter country.',
                          params: true
            }
        });
    }
    
    var vm = {
        books: ko.observableArray([]),
        booksInCart: ko.observableArray([]),
        showCart: ko.observable(false),
        currentCheckoutStepNum: ko.observable(1),
        checkoutBillingAddress: ko.validatedObservable(new Address(false)),
        checkoutMailingAddress: ko.validatedObservable(new Address(true)),
        showCheckoutMailingAddressForm: ko.observable("No"),
        
        addToCart: function (book){
            book.isInCart(true);
            vm.booksInCart.push(book);
            toastr["success"](book.title + " was added to cart");
        },
                
        removeFromCart: function(book){
            book.isInCart(false);
            vm.booksInCart.remove(book);
            toastr["success"](book.title + " was removed from cart");
        },
        
        toggleShowCart: function(){
            vm.showCart(!vm.showCart());
        },
        
        incrementCurrentCheckoutStepNum: function(vm){
            vm.currentCheckoutStepNum(vm.currentCheckoutStepNum() + 1);
        },
        
        decrementCurrentCheckoutStepNum: function(vm){
            vm.currentCheckoutStepNum(vm.currentCheckoutStepNum() - 1);
        },
        
        setCurrentCheckoutStepNum: function(stepNum, vm){
            vm.currentCheckoutStepNum(parseInt(this));
        },
        
        cancelCheckout: function(vm){
            if(vm.currentCheckoutStepNum() > 1)
                vm.currentCheckoutStepNum(2);
            //TODO: delete all payment information
        }
    };
    
    function initViewModel(){
        var bookArray = [
            {title: "Book Title 1", description: "A little description", 
             detailsExpanded: ko.observable(false), isInCart: ko.observable(false)},
            {title: "Book Title 2", description: "A little description", 
             detailsExpanded: ko.observable(false), isInCart: ko.observable(false)},
            {title: "Book Title 3", description: "A little description", 
             detailsExpanded: ko.observable(false), isInCart: ko.observable(false)},
            {title: "Book Title 4", description: "A little description", 
             detailsExpanded: ko.observable(false), isInCart: ko.observable(false)},
            {title: "Book Title 5", description: "A little description", 
             detailsExpanded: ko.observable(false), isInCart: ko.observable(false)},
            {title: "Book Title 6", description: "A little description", 
             detailsExpanded: ko.observable(false), isInCart: ko.observable(false)},
            {title: "Book Title 7", description: "A little description", 
             detailsExpanded: ko.observable(false), isInCart: ko.observable(false)}
        ];
        
        vm.books(bookArray);
    }
    
    // on page load event
    $(function() {
        
        ko.validation.init( {errorElementClass: 'has-error has-feedback'} );
        
        toastr.options = {
          "closeButton": false,
          "debug": false,
          "newestOnTop": false,
          "progressBar": false,
          "positionClass": "toast-bottom-full-width",
          "preventDuplicates": false,
          "onclick": null,
          "showDuration": "300",
          "hideDuration": "1000",
          "timeOut": "1500",
          "extendedTimeOut": "1000",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut"
        }
        
        initViewModel();
        
        // Closes the Responsive Menu on Menu Item Click
        $('.navbar-collapse ul li a').click(function() {
            $('.navbar-toggle:visible').click();
        });

//  scrap code from orgininal wizard template
//        allNextBtn.click(function(){
//            var curStep = $(this).closest(".setup-content"),
//                curStepBtn = curStep.attr("id"),
//                nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
//                curInputs = curStep.find("input[type='text'],input[type='url']"),
//                isValid = true;
//
//            $(".form-group").removeClass("has-error");
//            for(var i=0; i<curInputs.length; i++){
//                if (!curInputs[i].validity.valid){
//                    isValid = false;
//                    $(curInputs[i]).closest(".form-group").addClass("has-error");
//                }
//            }
//
//            if (isValid)
//                nextStepWizard.removeAttr('disabled').trigger('click');
//        });

//        $('div.setup-panel div a.btn-primary').trigger('click');

        $this.vm = vm;
        
        ko.applyBindings(vm);
    });
   return $this; 
})(Bookshelf || []);


// Here's a custom Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
// Could be stored in a separate utility library
ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function(element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        if( ko.unwrap(value))
            $(element).fadeIn();
    }
};
