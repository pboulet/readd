var Bookshelf = (function ($this){

    function Book(id, title, description, price, quantity, detailsExpanded, isInCart){
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.quantity = ko.observable(quantity);
        this.detailsExpanded = ko.observable(detailsExpanded);
        this.isInCart = ko.observable(isInCart);      
     }
    
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
            required: {
                          message: 'Please enter a postal code.',
                          params: true
            },
            pattern: {
                          message: 'Please enter a valid postal code.',
                          params:   '^[0-9]{5}$|^[A-Z][0-9][A-Z] ?[0-9][A-Z][0-9]$'
             //TODO: US & CAN pattern only for now - see http://html5pattern.com/Postal_Codes for patterns of other countries
            }
        });
       this.country = ko.observable('').extend({
            required: {
                          message: 'Please enter country.',
                          params: true
            }
        });
    }
    
    function PaymentInfo()
    {
        this.nameOnCard = ko.observable('').extend({
            required: {
                          message: 'Please enter the name that appears on the credit card.',
                          params: true
            },
            minLength: {
                          message: 'The must at least be 2 characters long.',
                          params: 2
            },
        });
        
        this.creditCardProvider = ko.observable('').extend({
            required: {
                          message: 'Please enter the name that appears on the credit card.',
                          params: true
            }
        });
        
        this.creditCardNumber = ko.observable('').extend({
            required: {
                          message: 'Please enter the number of the credit card.',
                          params: true
            },
            pattern: {
                          message: 'Please enter a valid credit card number.',
                          params:   '^(?:4[0-9]{12}(?:[0-9]{3})?' +         //  Visa
                                    '|  5[1-5][0-9]{14}' +                  //  MasterCard
                                    '|  3[47][0-9]{13}' +                   //  American Express
                                    '|  3(?:0[0-5]|[68][0-9])[0-9]{11}' +   //  Diners Club
                                    '|  6(?:011|5[0-9]{2})[0-9]{12}' +      //  Discover
                                    '|  (?:2131|1800|35\d{3})\d{11}' +      //  JCB
                                    ')$'
            }
        });
        
        this.expirationDateMonth = ko.observable('').extend({
            required: {
                          message: 'Please choose the expiration month of the credit card.',
                          params: true
            }
        });
        
        this.expirationDateYear = ko.observable('').extend({
            required: {
                          message: 'Please choose the expiration year of the credit card.',
                          params: true
            }
        });
        
        this.cardCVV = ko.observable('').extend({
            required: {
                          message: 'Please enter the security check code for the credit card.',
                          params: true
            }
        }); 
    }
    
    var vm = {
        books: ko.observableArray([]),
        booksInCart: ko.observableArray([]),
        viewableBooksInCart: ko.observableArray([]),
        viewableBooksInCartPageIndex: ko.observable(0),
        activeShowBookFullDescriptionBook: ko.observable(null),
        showBookFullDescriptionState : ko.observable(false),
        showCart: ko.observable(false),
        currentCheckoutStepNum: ko.observable(1),
        checkoutBillingAddress: ko.validatedObservable(new Address(false)),
        checkoutMailingAddress: ko.validatedObservable(new Address(true)),
        checkoutPaymentInfo: ko.validatedObservable(new PaymentInfo()),
        showCheckoutMailingAddressForm: ko.observable("No"),
        
        showBookFullDescription: function(book){
            vm.activeShowBookFullDescriptionBook(book);
            vm.showBookFullDescriptionState(true);
            Custombox.open({
                target: '#modalBookFullDescription',
                effect: 'slit'
            });
        },
        hideBookFullDescription: function(vm){
            vm.showBookFullDescriptionState(false);
            Custombox.close({
                target: '#modalBookFullDescription',
            });
        },
        addToCart: function (book){
            var bookToAdd = null;
            if(vm.showBookFullDescriptionState())
                bookToAdd = vm.activeShowBookFullDescriptionBook()
            else
                bookToAdd = book;
            bookToAdd.isInCart(true);
            vm.booksInCart.push(bookToAdd);
            toastr["success"](bookToAdd.title + " was added to cart");   
        },
                
        removeFromCart: function(book){
            var bookToRemove = null;
            if(vm.showBookFullDescriptionState())
                bookToRemove = vm.activeShowBookFullDescriptionBook()
            else
                bookToRemove = book;
            bookToRemove.isInCart(false);
            vm.booksInCart.remove(bookToRemove);
            toastr["success"](bookToRemove.title + " was removed from cart");
        },
        
        toggleShowCart: function(){
            vm.showCart(!vm.showCart());
        },
        
        decreaseViewableBooksInCartPageIndex: function(){
            var maxIndex = Math.ceil(vm.booksInCart().length/5) - 1;
            if(vm.viewableBooksInCartPageIndex() > 0)
                vm.viewableBooksInCartPageIndex(vm.viewableBooksInCartPageIndex() - 1);
            else
                vm.viewableBooksInCartPageIndex(maxIndex);
        },
        
        increaseViewableBooksInCartPageIndex: function(){
            var maxIndex =  Math.ceil(vm.booksInCart().length/5) - 1;
            if(vm.viewableBooksInCartPageIndex() < maxIndex)
                vm.viewableBooksInCartPageIndex(vm.viewableBooksInCartPageIndex() + 1);
            else
                vm.viewableBooksInCartPageIndex(0);
        },
        
        toggleShowDetails: function(book){
            book.detailsExpanded(!book.detailsExpanded());
        },
        
        completeCheckout: function(){
            vm.booksInCart().forEach(function(book) {
                book.isInCart(false);
                book.detailsExpanded(false);
            });
            vm.showCart(false);
            vm.booksInCart.removeAll();
            $('#checkoutModal').modal('hide');
            toastr["success"]('<br>Your reference number is 1982451893123. <br>Keep it in a safe place.  <br><br>You will receive a confirmation copy of your invoice by email shortly.', 
                              'Payment completed. <br>Thank you for shopping with us!<br>', 
                              {
                                positionClass : "toast-top-center",
                                closeButton: true,
                                timeOut: 10000000
                              });
        },
        
        incrementCurrentCheckoutStepNum: function(vm){
            
            var errorsFound = false;
            
            // check for errors depending on which page we are on
            if(vm.currentCheckoutStepNum() == 1 &&
                (!vm.checkoutBillingAddress.isValid() ||  
                   (vm.showCheckoutMailingAddressForm() == "Yes" && !vm.checkoutMailingAddress.isValid()))){
                errorsFound = true;
            }else if(vm.currentCheckoutStepNum() == 2 && !vm.checkoutPaymentInfo.isValid()){
                errorsFound = true;
            }
            
            // execute action depending on if we have found errors or not
            if(errorsFound){
                
                var totalNumberOfErrors = 0;
                
                if(vm.currentCheckoutStepNum() == 1){
                    
                    totalNumberOfErrors += vm.checkoutBillingAddress.errors().length;
                    vm.checkoutBillingAddress.errors.showAllMessages();

                    if(vm.showCheckoutMailingAddressForm() == "Yes"){
                        totalNumberOfErrors += vm.checkoutMailingAddress.errors().length;
                        vm.checkoutMailingAddress.errors.showAllMessages();
                    }
                }else if (vm.currentCheckoutStepNum() == 2){
                    totalNumberOfErrors += vm.checkoutPaymentInfo.errors().length;
                    vm.checkoutPaymentInfo.errors.showAllMessages();
                }
                
                toastr["error"]('Please check your input data and correct it.',
                                totalNumberOfErrors + ' errors found in the form.', 
                                {timeOut: 7000});
            }else{                
                vm.currentCheckoutStepNum(vm.currentCheckoutStepNum() + 1);
            }
        },
        
        decrementCurrentCheckoutStepNum: function(vm){
            vm.currentCheckoutStepNum(vm.currentCheckoutStepNum() - 1);
        },
        
        setCurrentCheckoutStepNum: function(stepNum, vm){
            vm.currentCheckoutStepNum(parseInt(this));
        },
        
        cancelCheckout: function(vm){
            
        }
    };
    
    function initViewModel(){
        var bookArray = [];
        for(var i = 0; i < 50; i++){
            bookArray.push(new Book(i, "Book " + i + " title" , "Book " + i + " description", 10.00, 1, false, false));
        }
        
        vm.books(bookArray);
        vm.activeShowBookFullDescriptionBook(vm.books()[0]);
        vm.cartSubTotal = ko.computed(function(){
            var subTotal = 0;
            vm.booksInCart().forEach(function(book) {
                subTotal += book.price * book.quantity();
            });
            return subTotal;
        }, vm);
        
        function updateCartCarousel(){
            var numOfBooksPerPage = 5;
            vm.viewableBooksInCart([]);
            for(var i = vm.viewableBooksInCartPageIndex() * numOfBooksPerPage; i < (vm.viewableBooksInCartPageIndex() * numOfBooksPerPage + numOfBooksPerPage); i++){
                if(vm.booksInCart()[i] != null)
                    vm.viewableBooksInCart.push(vm.booksInCart()[i]);
            }  
        }
        
        vm.booksInCart.subscribe(function(){
            updateCartCarousel();
        });
        
        vm.viewableBooksInCartPageIndex.subscribe(function(){
            updateCartCarousel();
        });
    }
    
    // on page load event
    $(function() {
        
        // configure for knockout-validation
        ko.validation.init( {
            errorElementClass: 'has-error',
            errorMessageClass: 'help-block'
        });
        
        // configure toastr
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
        };
        
        // configure & initialize chosen
        $(".chosen-select").chosen({no_results_text: "Oops, nothing found!"}); 
        
        var options = {
            cell_height: 80,
            vertical_margin: 10
        };
        $('.grid-stack').gridstack(options);
        
        $('#element').on('click', function ( e ) {
            Custombox.open({
                target: '#modal',
                effect: 'fadein'
            });
            e.preventDefault();
        });
        
        initViewModel();
        
        // Closes the Responsive Menu on Menu Item Click
        $('.navbar-collapse ul li a').click(function() {
            $('.navbar-toggle:visible').click();
        });
        
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
        ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
    }
};

ko.bindingHandlers.hoverTargetId = {};
ko.bindingHandlers.hoverVisible = {
    init: function (element, valueAccessor, allBindingsAccessor) {

        function showOrHideElement(show) {
            var canShow = ko.utils.unwrapObservable(valueAccessor());
            $(element).toggle(show && canShow);
        }

        var hideElement = showOrHideElement.bind(null, false);
        var showElement = showOrHideElement.bind(null, true);
        var $hoverTarget = $("#" + ko.utils.unwrapObservable(allBindingsAccessor().hoverTargetId));
        ko.utils.registerEventHandler($hoverTarget, "mouseover", showElement);
        ko.utils.registerEventHandler($hoverTarget, "mouseout", hideElement);
        hideElement();
    }
};
