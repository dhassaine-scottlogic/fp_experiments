import {assert} from 'chai';
import * as R from 'ramda';

describe('ramdaTest', function () {
    describe('hello', function () {
        it('mocha is working', function () {
            assert.equal(true, true);
        });

    });
});

describe('point free programming style', function () {
    const students = [
        { name: "A", grade: 3, height: 50 },
        { name: "B", grade: 2, height: 40 },
        { name: "C", grade: 3, height: 60 },
        { name: "D", grade: 4, height: 55 },
        { name: "E", grade: 5, height: 55 },
        { name: "F", grade: 6, height: 45 },
        { name: "G", grade: 2, height: 66 },
    ];

    describe('"imperative solution', function () {
        it("calculates average heights imperatively", function () {
            const heightOfStudentsInGrade3 = students.filter((student) => student.grade === 3).map((student) => student.height);
            const averageHeightOfStudentsInGrade3 = heightOfStudentsInGrade3.reduce((sum, height) => sum + height, 0) / heightOfStudentsInGrade3.length;
            assert.equal(averageHeightOfStudentsInGrade3, 55);
        });

    });

    describe('fp solution', function () {
        it('Allows multiple functions to piped/composed with a single data argument', function () {
            const averageHeightOfStudentsInGrade3 = R.pipe(R.filter(R.propEq('grade', 3)), R.map(R.prop('height')), R.mean);
            assert.equal(averageHeightOfStudentsInGrade3(students), 55);
        });
    });
});


describe('filter, pick and sort data problem', function () {
    const taskData = {
        result: "SUCCESS",
        interfaceVersion: "1.0.3",
        requested: "10/17/2013 15:31:20",
        lastUpdated: "10/16/2013 10:52:39",
        tasks: [
            {
                id: 104, complete: false, priority: "high",
                dueDate: "2013-11-29", username: "Scott",
                title: "Do something", created: "9/22/2013"
            },
            {
                id: 105, complete: false, priority: "medium",
                dueDate: "2013-11-22", username: "Lena",
                title: "Do something else", created: "9/22/2013"
            },
            {
                id: 107, complete: true, priority: "high",
                dueDate: "2013-11-22", username: "Mike",
                title: "Fix the foo", created: "9/22/2013"
            },
            {
                id: 108, complete: false, priority: "low",
                dueDate: "2013-11-15", username: "Punam",
                title: "Adjust the bar", created: "9/25/2013"
            },
            {
                id: 110, complete: false, priority: "medium",
                dueDate: "2013-11-15", username: "Scott",
                title: "Rename everything", created: "10/2/2013"
            },
            {
                id: 112, complete: true, priority: "high",
                dueDate: "2013-11-27", username: "Lena",
                title: "Alter all quuxes", created: "10/5/2013"
            }
        ]
    };
    function fetchTaskData() {
        return Promise.resolve(taskData);
    }
    /*
        getIncompleteTaskSummaries(): accepts a membername parameter, then fetches the data from the server (or somewhere), 
        chooses the tasks for that member that are not complete, 
        returns their ids, priorities, titles, and due dates, sorted by due date. 
        Actually, it returns a Promise that should resolve into that sort of list.
    */

    //getIncompleteTaskSummaries(Scott) =>
    const expectedAnswer = [
        {
            id: 110, title: "Rename everything",
            dueDate: "2013-11-15", priority: "medium"
        },
        {
            id: 104, title: "Do something",
            dueDate: "2013-11-29", priority: "high"
        }
    ];


    describe('fp with some ramda', function () {
        function filterUserName(username) {
            return (tasks) => tasks.filter((task) => task.username === username);
        }
        function filterOutstandingTasks(tasks) {
            return tasks.filter((task) => !task.complete)
                .map(({id, title, dueDate, priority}) => Object.assign({}, { id, title, dueDate, priority }));                
        }        
        function descSort(property) {
            return (data) => data.sort((a, b) => a[property].localeCompare(b[property]));
        }        

        function getIncompleteTaskSummaries(username) {            
            return R.pipeP(fetchTaskData, pluckTasks, filterUserData, filterOutstandingTasks, sortBydueDateDescending)();
            
            function filterUserData(data) {
              return filterUserName(username)(data);  
            } 
            function sortBydueDateDescending(data) {
                return descSort('dueDate')(data);
            }
            function pluckTasks(httpResponse) {                
                return httpResponse.tasks;
            }
        }
        it('returns unfinished tasks sorted by due dates in ascending order', function (done) {
            getIncompleteTaskSummaries('Scott')
                .then((answer) => done(assert.deepEqual(answer, expectedAnswer)))
                .catch((error) => done(error));
        });
    });

   describe('ramda', function () {
       
        function filterUserData (username) {
            return R.filter(R.propEq('username',username));
        }
        
        const isUnComplete = (task) => !task.complete;
        const filterOutstandingTasks = R.pipe(
                R.filter(isUnComplete),
                R.map(R.pick(['id', 'title', 'dueDate', 'priority'])));    
               
        function descSort(property) {
            return (a, b) => a[property].localeCompare(b[property]);
        }        

        function getIncompleteTaskSummaries(username) {            
            return R.pipeP(fetchTaskData, R.prop('tasks'), filterUserData(username), filterOutstandingTasks, R.sort(descSort('dueDate')));           
        }
        
        it('returns unfinished tasks sorted by due dates in ascending order', function (done) {
            getIncompleteTaskSummaries('Scott')()
                .then((answer) => done(assert.deepEqual(answer, expectedAnswer)))
                .catch((error) => done(error));
        });
    });

});
