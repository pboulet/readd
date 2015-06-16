var Bookshelf = (function ($this){

    var vm = {
        books: ko.observableArray([]),
        booksInCart: ko.observableArray([]),
        showCart: ko.observable(false),
        
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
