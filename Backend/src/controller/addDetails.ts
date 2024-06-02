import { Request, Response } from 'express';

let teachers: any[] = [];
let courses: any = {};
let classrooms: any[] = [];

export const addTeachers = async (req: Request, res: Response) => {
    teachers = req.body.teachers;
    res.json({ message: 'Teachers added successfully' });
};

export const addClassrooms = async (req: Request, res: Response) => {
    classrooms = req.body.classrooms;
    res.json({ message: 'Classrooms added successfully' });
};

export const addCourses = async (req: Request, res: Response) => {
    courses = req.body;
    res.json({ message: 'Courses added successfully' });
};

export const generateTimetable = (req: Request, res: Response) => {
    if (!teachers.length || !courses.subjects || !classrooms.length) {
        return res.status(400).json({ message: 'Please add teachers, courses, and classrooms first.' });
    }

    const timetable = createTimetable(teachers, courses, classrooms);
    res.json(timetable);
};

function createTimetable(teachers: any[], courses: any, classrooms: any[]): any {
    const timetable: any = {};

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const times = ['10:00 AM to 11:00 AM', '11:00 AM to 12:00 PM', '12:00 PM to 1:00 PM', '3:00 PM to 4:00 PM'];

    const subjects = courses.subjects ? courses.subjects : [];
    const numClassrooms = classrooms.length;
    const numSubjects = subjects.length;
    
   
    for (const classroom of classrooms) {
        timetable[classroom] = {};

        for (const day of days) {
            timetable[classroom][day] = {};

            for (let i = 0; i < times.length; i++) {
                const subject = subjects[i % numSubjects];
                const teacher = subject.teacher;

                if (!timetable[classroom][day][times[i]]) {
                    timetable[classroom][day][times[i]] = { subject: subject.name, teacher, classroom };
                }
            }
        }
    }

    return timetable;
}