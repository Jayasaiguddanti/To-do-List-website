$(function(){
    function Loadview(url){
        $.ajax({
            method:'get',
            url: url,
            success:(response)=>{
                $("section").html(response);
            }
        })
    }
    Loadview("../public/home.html");
    $(document).on("click","#btncreate",()=>{
        Loadview("../public/user-register.html");
    })
    $(document).on("click","#btnsignin",()=>{
        Loadview("../public/user-login.html");
    })
    $(document).on("click","#btncancel",()=>{
        Loadview("../public/home.html");
    })

    $(document).on("click","#btnregister",()=>{
        var user={
            UserId: $("#Ruserid").val(),
            UserName: $("#Rusername").val(),
            Password: $("#Rpassword").val(),
            Email: $("#Remail").val(),
            Mobile: $("#Rmobile").val()
        };
        $.ajax({
            method:'post',
            url:"http://127.0.0.1:2020/register-user",
            data: user
        })
        alert("Registered Successfully..");
        Loadview("../public/user-login.html");
    })

    $(document).on("keyup","#Ruserid",(e)=>{
        $.ajax({
            method:'get',
            url : "http://127.0.0.1:2020/users",
            success:(users=>{
                for(var user of users){
                    if(user.UserId===e.target.value){
                        $("#useriderr").html('User id has already taken').addClass('text-danger');
                        break;
                    }
                    else{
                        $("#useriderr").html('User id available').addClass('text-success').removeClass('text-danger');
                    }
                }
            })
        })
    })
    $(document).on("click","#btnlogin",()=>{
        var userid = $("#txtuserid").val();
        var pass = $("#txtpassword").val();
        $.ajax({
            method: 'get',
            url: "http://127.0.0.1:2020/users",
            success: (users=>{
                var user = users.find(record=> record.UserId===userid);
                if(!user || !pass){
                    alert("Please enter your credentials");
                    return;
                }
                if(user){
                    if(user.Password===pass){
                        Loadview("../public/user-dashboard.html");
                        appointment(userid);
                        $.cookie("userid", userid);
                        $.cookie("username",user.UserName);
                    }else{
                        alert("Incorrect password");
                    }
                }else{
                    alert("Invalid user id"); 
                }
            })
        })
    })
    function appointment(userId){
        $.ajax({
            method: 'get',
            url : `http://127.0.0.1:2020/get-appointments/${userId}`,
            success : (appointments=>{
                $("#lbluserid").html($.cookie("username"));
                appointments.map(appointment=>{
                    $(`
                        <div class="alert alert-success alert-dismissible m-4">
                            <button class="btn btn-close" data-bs-dismiss="alert"></button>
                            <h3>${appointment.Title}</h3>
                            <p> ${appointment.Description}</p>
                            <p> ${appointment.Date}</p>
                            <button value=${appointment.AppointmentId} id="btnedit" class="btn btn-warning bi bi-pen-fill"></button>
                            <button value=${appointment.AppointmentId} id="btndelete" class="btn btn-danger bi bi-trash-fill"></button>
                        </div>    
                    `).appendTo("#appcontainer");
                })
            })
        })
    }
    $(document).on("click","#signout",()=>{
        $.removeCookie('userid');
        $.removeCookie('username');
        Loadview("../public/user-login.html");
    })

    $(document).on("click","#newapp",()=>{
        Loadview("../public/add-appoint.html");
    });

    $(document).on("click","#addbtn",()=>{
        var appointment={
            AppointmentId: $("#txtid").val(),
            Title: $("#txttitle").val(),
            Description : $("#txtdesc").val(),
            Date: $("#date").val(),
            Time: $("#date").val(),
            UserId: $.cookie("userid")
        }
        $.ajax({
            method:'post',
            url: "http://127.0.0.1:2020/add-appointment",
            data: appointment,
        })
        alert("Appointment added successfully..");
        Loadview("../public/user-dashboard.html");
        appointment($.cookie("userid"));
    });
    $(document).on("click","#cancelbtn",()=>{
        Loadview("../public/user-dashboard.html");
        appointment($.cookie('userid'));
    });
    $(document).on("click","#btnedit",(e)=>{
        Loadview("../public/edit-appoint.html");
        $.ajax({
            method: "get",
            url: `http://127.0.0.1:2020/get-appointment/${e.target.value}`,
            success: (appointment)=>{
                $("#editid").val(appointment.AppointmentId);
                $("#edittitle").val(appointment.Title);
                $("#editdesc").val(appointment.Description);
                var sai = appointment.Date;
                var d = sai.slice(0,sai.indexOf("T"));
                var t = sai.slice(sai.indexOf("T")+1,sai.length-1);
                $("#editdate").val(`${d} ${t}`);
            }
        })
    });
    $(document).on("click","#editcancel",()=>{
        Loadview("../public/user-dashboard.html");
        appointment($.cookie('userid'));
    });

    $(document).on("click","#btnsave",()=>{
        var appointments={
            AppointmentId: $("#editid").val(),
            Title: $("#edittitle").val(),
            Description : $("#editdesc").val(),
            Date: $("#editdate").val(),
            Time: $("#editdate").val(),
            UserId: $.cookie("userid")
        }
        $.ajax({
            method:'put',
            url: `http://127.0.0.1:2020/edit-appointment/${$("#editid").val()}`,
            data: appointments,
        })
        alert("Appointment changed successfully..");
        Loadview("../public/user-dashboard.html");
        appointment($.cookie('userid'));
    });

    $(document).on("click","#btndelete",(e)=>{
        Loadview("../public/delete-appoint.html");
        $.ajax({
            method: "get",
            url: `http://127.0.0.1:2020/get-appointment/${e.target.value}`,
            success: (appointment)=>{
                $("#titlelbl").html(appointment.Title);
                $("#desclbl").html(appointment.Description);
                $("#idtxt").val(appointment.AppointmentId);
            }
        })
    });
    $(document).on("click","#btneditcancel",()=>{
        Loadview("../public/user-dashboard.html");
        appointment($.cookie('userid'));
    });

    $(document).on("click","#btndel",()=>{
        $.ajax({
            method:'delete',
            url: `http://127.0.0.1:2020/delete-appointment/${$("#idtxt").val()}`,
        })
        alert("Appointment deleted successfully..");
        Loadview("../public/user-dashboard.html");
        appointment($.cookie('userid'));
    });
})