/// <reference path="jquery-3.3.1.js" />
$(document).ready(function () {
    infoNamespace.init();
});

(function () {
    this.infoNamespace = this.infoNamespace || {};
    var ns = this.infoNamespace;
    var currentInfo;

    ns.init = function () {
        $('#upImage').on('change', bindImage);
        $('#btnSubmit').on('click', function (e) {
            e.preventDefault();
            ns.save();
        });
        $('#clearBtn').on('click', ns.clearinfo);
        ns.display();
    }

    function bindImage(e) {
        var file = e.originalEvent.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (evt) {
            var result = evt.target.result;
            $('#uImage')
                .attr('src', e.target.result)
                .width(200)
                .height(200);
            $('#uImage').removeAttr('src');
            $('#uImage').attr('src', result);
        }
    }
   
    ns.display = function () {
        currentInfo = { key: null, info: {} };
        var results = infoRetreive();
        bindToGrid(results);
    }

    function infoRetreive() {
        var allInfo = JSON.parse(localStorage.getItem('infos'));
        return allInfo ? allInfo : [];
    }

    function bindToGrid(results) {
        var html = '';
        for (var i = 0; i < results.length; i++) {
            var info = results[i];
            html += '<tr><td class="displayImg"><img class="img-responsive" src="' + info.image + '"/></td>';
            html += '<td>' + info.id + '</td>';
            html += '<td>' + info.name + '</td>';
            html += '<td>' + info.phone + '</td>';
            html += '<td>' + info.email + '</td>';
            html += '<td>' + info.nid + '</td>';
            html += '<td>' + info.maritalStatus + '</td>';
            html += '<td>' + info.Address + '</td>';
            html += '<td>' + info.jobtitle + '</td>';
            html += '<td>' + info.salary + '</td>';
            html += '<td>' + info.joinDate + '</td>';
            html += '<td><a class="edit" href="javascript:void(0)" data-key="' + i + '"><i class="fa fa-edit"></i></a></td>';
            html += '<td><a class="delete" href="javascript:void(0)" data-key="' + i + '"><i class="fa fa-trash"></i></a></td></tr>';
        }
        html = html || '<tr><td colspan="13"><p style="text-align:center; font-size:30px;">No Records Available</p></td></tr>';
        $('#InfoTable').html('<table id="InfoTable" class="table table-responsive table-bordered">' +
            '<tr><th>Photo</th><th>ID</th><th>Name</th><th>Contact No</th>' +
            '<th>Email</th><th>NID NO</th><th>M.Status</th><th>Address</th>' +
            '<th>Job Title</th><th>Salary</th><th>Join Date</th><th>Edit</th><th>Delete</th>' +
            '</tr></table>');
        $('#InfoTable').append(html);
        $('a.edit').on('click', ns.loadinfo);
        $('a.delete').on('click', ns.deleteinfo);
    }

    ns.deleteinfo = function () {
        var key = parseInt($(this).attr('data-key'));
        var results = infoRetreive();
        $.each(results, function (index, obj) {
            results.splice(key, 1);
            localStorage.setItem('infos', JSON.stringify(results));
            ns.display();
            return false;
        });
    }

    ns.loadinfo = function () {
        var key = parseInt($(this).attr('data-key'));
        var results = infoRetreive();
        $('#headStatus, #btnSubmit').html('Update');
        //$('.getImg-status').html('change image');
        currentInfo = { key: key, info: results[key] };
        displayCurrentinfo();
    }

    function displayCurrentinfo() {
        var info = currentInfo.info;
        $('#id').val(info.id);
        $('#name').val(info.name);
        $('#phone').val(info.phone);
        $('#email').val(info.email);
        $('#nid').val(info.nid);
        $('#maritalStatus').val(info.maritalStatus);
        $('#Address').val(info.Address);
        $('#jobtitle').val(info.jobtitle);
        $('#salary').val(info.salary); 
        $('#joinDate').val(info.joinDate); 
        $('#uImage').attr('src', info.image);
    }

    ns.save = function () {
        var img = new Image();
        var info = currentInfo.info;
        info.id = $('#id').val();
        info.name = $('#name').val();
        info.phone = $('#phone').val();
        info.email = $('#email').val();
        info.nid = $('#nid').val();
        info.maritalStatus = $('#maritalStatus').val();
        info.Address = $('#Address').val();
        info.jobtitle = $('#jobtitle').val();
        info.salary = $('#salary').val(); 
        info.joinDate = $('#joinDate').val(); 
        img.src = $('#uImage').attr('src');
        info.image = img.src;

        var results = infoRetreive();

        if (currentInfo.key != null) {
            results[currentInfo.key] = info;
            localStorage.setItem('infos', JSON.stringify(results));
            clearInput();
            ns.display();
        }
        else {
            if (info.id && info.name && info.email && info.phone) {
                results.push(info);
                localStorage.setItem('infos', JSON.stringify(results));
                clearInput();
                ns.display();
            } else {
                var html = '';
                html += '<p style="color:red;">Fill required Field(eg. info Name, ID, Email etc.)</p>';
                $('.infoAdd-box').append(html);
            }

        }

    }

    function clearInput() {
        $('#id').val('');
        $('#name').val('');
        $('#phone').val('');
        $('#email').val('');
        $('#nid').val('');
        $('#maritalStatus').val('');
        $('#Address').val('');
        $('#jobtitle').val('');
        $('#salary').val('');
        $('#joinDate').val('');
        $('#uImage').attr('src', 'Resource/images/placeholder.png');
    }

    ns.clearinfo = function () {
        if (localStorage.length != 0) {
            localStorage.clear();
            $("#infoTable").find("tr:gt(0)").remove();
            ns.display();
        }
    }



})();