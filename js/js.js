(function ($) {

    $(document).ready(function () {

        $('.calc-button').magnificPopup({
            closeOnBgClick: false
        });


        $('.calc-form button[name="calc"]')
            .click(function () {
                let form = $(this).closest('form');

                form.find('[data-calc-message]').html('');

                let sum = parseInt(form.find('input[name="sum"]').val());
                let term = parseInt(form.find('select[name="term"]').val());
                let contribution = parseInt(form.find('select[name="contribution"]').val());

                if (!(sum > 0)) {
                    $(this).closest('.form-group').find('[data-calc-message]').html('Введите сумму кредита');

                    return false;
                }

                let price = 0;

                if (contribution > 0) {
                    price = Math.ceil((sum - sum * (contribution / 100)) / term);
                } else {
                    price = Math.ceil(sum / term);
                }

                $('[data-calc-form-total]').html(number_format(price, 0, ', ', ' '));

                $('[data-calc-form-result]').show();
                $('[data-calc-form-contact]').show();

                return false;
            });


        $('.calc-form button[name="send"]')
            .click(function () {
                let form = $(this).closest('form');

                form.find('[data-calc-message]').html('');

                let sum = parseInt(form.find('input[name="sum"]').val());
                let term = parseInt(form.find('select[name="term"]').val());
                let contribution = parseInt(form.find('select[name="contribution"]').val());
                let name = form.find('input[name="name"]').val();
                let phone = form.find('input[name="phone"]').val();

                $.ajax('/send.php', {
                    type: 'post',
                    data: form.serialize(),
                    success: function (data) {
                        console.log('error' in data);

                        if ('error' in data) {
                            $('.calc-form button[name="send"]')
                                .closest('.form-group')
                                .find('[data-calc-message]')
                                .html(data.error);
                        } else {
                            $('[data-calc-form]').hide();
                            $('[data-calc-form-complete]').show();
                        }
                    },
                    error: function (data) {
                        console.log(data);
                    }
                });

                return false;
            });

    });


    number_format = function (number, decimals, dec_point, thousands_sep) {	// Format a number with grouped thousands
        //
        // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +	 bugfix by: Michael White (http://crestidg.com)

        var i, j, kw, kd, km;

        // input sanitation & defaults
        if (isNaN(decimals = Math.abs(decimals))) {
            decimals = 2;
        }
        if (dec_point == undefined) {
            dec_point = ",";
        }
        if (thousands_sep == undefined) {
            thousands_sep = ".";
        }

        i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

        if ((j = i.length) > 3) {
            j = j % 3;
        } else {
            j = 0;
        }

        km = (j ? i.substr(0, j) + thousands_sep : "");
        kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
        //kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).slice(2) : "");
        kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");


        return km + kw + kd;
    }


})(jQuery);