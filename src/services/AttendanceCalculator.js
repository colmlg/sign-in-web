import moment from "moment";

class AttendanceCalculator {
    static calculateOverallModuleAttendance(students, lessons) {
        let attendance = {};

        attendance.dayOfWeek = this.calculateByDayOfWeek(lessons);

        const lectures = lessons.filter(l => l.type === 'LEC');
        if(lectures.length > 0) {
            const lectureAttendance = this.calculateLectureAttendance(students, lectures);
            attendance.overallLec = lectureAttendance.overall;
            attendance.lecStudent = lectureAttendance.perStudent;
        }


        const labs = lessons.filter(l => l.type === 'LAB');
        if(labs.length > 0) {
            const labAttendance = this.calculateLabAndTutAttendance(students, labs);
            attendance.overallLab = labAttendance.overall;
            attendance.labStudent = labAttendance.perStudent;
        }


        const tuts = lessons.filter(l => l.type === 'TUT');
        if(tuts.length > 0) {
            const tutAttendance = this.calculateLabAndTutAttendance(students, tuts);
            attendance.overallTut = tutAttendance.overall;
            attendance.tutStudent = tutAttendance.perStudent;
        }

        this.calculateOverall(attendance);


        return attendance;
    }

    static calculateByDayOfWeek(lessons) {
        const attendance = [0, 0, 0, 0, 0, 0, 0]; //Monday to Friday
        const numLessons = [0, 0, 0, 0, 0, 0, 0];
        lessons.forEach(l => {
            const day = moment(l.date).weekday();
            const numAttended = l.studentsAttended.length;
            attendance[day] += numAttended;
            numLessons[day]++;
        });
        for(let i = 0; i < attendance.length; i++) {
            if (numLessons[i] > 0)
                attendance[i] = attendance[i] / numLessons[i];
        }
        return attendance;
    }

    static calculateOverall(attendance) {
        let counter = 0;
        let sum = 0;
        if(attendance.overallLec !== undefined) {
            sum += attendance.overallLec;
            counter++;
        }

        if(attendance.overallLab !== undefined) {
            sum += attendance.overallLab;
            counter++;
        }

        if(attendance.overallTut !== undefined) {
            sum += attendance.overallTut;
            counter++;
        }

        attendance.overall = sum / counter;
        if(isNaN(attendance.overall)) { // counter may be 0, producing NaN
            attendance.overall = 0;
        }
    }

    static calculateLectureAttendance(students, lessons) {
        const attendance = {
            overall: 0,
            perStudent: [],
        };
        const totalLessons = lessons.length;
        students.forEach(s => {
            const lessonsAttended = lessons.filter(l => l.studentsAttended.indexOf(s) !== -1).length;
            const percentage = ((lessonsAttended / totalLessons) * 100.0);
            attendance.perStudent.push({id: s, attendance: percentage});
        });

        attendance.overall = this.getAverage(attendance.perStudent);
        return attendance;
    }

    static calculateLabAndTutAttendance(students, lessons) {
        const attendance = {
            overall: 0,
            perStudent: [],
        };

        let lessonsCopy = [...lessons];
        for(let i = 0; i < lessonsCopy.length; i++) {
            let lesson = lessonsCopy.shift();
            lessonsCopy = lessonsCopy.filter(l => !moment(lesson.date).isSame(moment(l.date), 'week'));
            lessonsCopy.push(lesson)
        }
        const goalNumber = lessonsCopy.length; //You must have attended this many labs to get 100%, i.e. 1 a week.

        //Attending two labs in one weeks will falsely push this number up...
        students.forEach(s => {
            const lessonsAttended = lessons.filter(l => l.studentsAttended.indexOf(s) !== -1).length;
            let percentage = ((lessonsAttended / goalNumber) * 100.0);
            if (percentage > 100) {
                percentage = 100;
            }
            attendance.perStudent.push({id: s, attendance: percentage});
        });

        attendance.overall = this.getAverage(attendance.perStudent);
        return attendance;
    }

    static getAverage(perStudent) {
        let sum = 0;
        perStudent.forEach(s => {
            sum += parseInt(s.attendance);
        });
        let average = sum / perStudent.length;
        if(isNaN(average)) {
            average = 0;
        }
        return average;
    }
};

export default AttendanceCalculator;