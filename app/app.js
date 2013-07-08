var timeclock = angular.module("timeclock", [])
.config(function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when("/timeclock", { controller: "clock", templateUrl: "/timeclock/app/views/clock.html" })
        .when("/timeclock/admin/", { controller: "edit", templateUrl: "/timeclock/app/views/edit.html" })
        .when("/timeclock/admin/report", { controller: "report", templateUrl: "/timeclock/app/views/report.html" })
        .when("/timeclock/admin/users", { controller: "users", templateUrl: "/timeclock/app/views/users.html" })
        .otherwise({ redirectTo: '/timeclock' });
});
timeclock.factory('usersApi', ['$http', function($http) {
    return {
        add : function(name) {
            //
        },
        get : function(active) {
            return $http.get("/timeclock/api/?action=usersGet&active=" + active);
        },
        update : function(id) {
            //
        }
    };
}]);
timeclock.factory('clockApi', ['$http', function($http) {
    return {
        add : function(user, start, end) {
            //
        },
        clockIn : function(user) {
            return $http.get("/timeclock/api/?action=clockAdd&user=" + user);
        },
        get : function(user, start, end) {
            return $http.get("/timeclock/api/?action=clockGet&user=" + user + "&start=" + start + "&end=" + end);
        },
        getLast : function(user) {
            return $http.get("/timeclock/api/?action=clockGet&user=" + user);
        },
        update : function(id, start, end) {
            //
        },
        clockOut : function(user, end) {
            return this.getLast(user).then(function(response) {
                return $http.get("/timeclock/api/?action=clockUpdate&id=" + response.data.id + "&end=" + end);
            });
        },
        delete : function(id) {
            //
        }
    };
}]);
timeclock.factory('payperiodFactory', function() {
    var dateStart = moment('2013-01-07').isoWeek()%2;
    return {
        periodDates : function(date) {
            var momentObj = {};
            momentDate = moment(date);
            if (momentDate.isoWeek()%2 === dateStart) {
                momentDate.day()===0 ? momentDate.day(-7) : momentDate.startOf('week').day(1);
            } else {
                momentDate.day()===0 ? momentDate.day(-13) : momentDate.startOf('week').day(-6);
            }
            momentObj['firstWeekStart'] = momentDate.format('YYYY-MM-DD');
            momentObj['secondWeekStart'] = momentObj['firstWeekEnd'] = moment(momentDate).day(8).format('YYYY-MM-DD');
            momentObj['secondWeekEnd']  = moment(momentDate).day(15).format('YYYY-MM-DD');
            return momentObj;
        }
    };
});
timeclock.factory('totaltimeFactory', function() {
    return {
        getTotal : function(obj) {
            var total = 0;
            angular.forEach(obj, function(value, key) {
                if (value.totalTime !== null)
                    total += Number(value.totalTime);
            });
            return total;
        }
    };
});