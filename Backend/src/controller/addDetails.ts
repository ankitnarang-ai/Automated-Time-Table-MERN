import { Request, Response } from 'express';

// Interfaces for better type safety
interface Teacher {
    id: string;
    name: string;
}

interface Subject {
    name: string;
    teacher: string;
}

interface Course {
    name: string;
    subjects: Subject[];
}

// State variables with proper types
let teachers: Teacher[] = [];
let courses: Course = { name: '', subjects: [] };
let classrooms: string[] = [];

export const addTeachers = async (req: Request, res: Response) => {
    try {
        const newTeachers = req.body;
        if (!Array.isArray(newTeachers)) {
            return res.status(400).json({ message: 'Teachers must be an array' });
        }

        teachers = newTeachers.map(teacher => {
            if (typeof teacher.id !== 'string' || typeof teacher.name !== 'string') {
                throw new Error('Invalid teacher data');
            }
            return { id: teacher.id, name: teacher.name };
        });

        console.log('Received teachers:', teachers);
        res.json({ message: 'Teachers added successfully', data: teachers });
    } catch (error) {
        console.error('Error adding teachers:', error);
        res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid teacher data' });
    }
};

export const addCourses = async (req: Request, res: Response) => {
    try {
        const { name, subjects } = req.body;
        if (typeof name !== 'string' || !subjects || !Array.isArray(subjects)) {
            return res.status(400).json({ message: 'Invalid course data' });
        }

        const validTeachers = new Set(teachers.map(t => t.name));
        const validSubjects = subjects
            .map(subject => {
                if (typeof subject.name !== 'string' || typeof subject.teacher !== 'string') {
                    console.warn(`Invalid subject structure: ${JSON.stringify(subject)}`);
                    return null;
                }
                return { name: subject.name, teacher: subject.teacher };
            })
            .filter((subject): subject is Subject => {
                if (subject === null) return false;
                if (!validTeachers.has(subject.teacher)) {
                    console.warn(`Invalid teacher: ${subject.teacher}`);
                    return false;
                }
                return true;
            });

        courses = { name, subjects: validSubjects };
        console.log('Received course:', courses);
        res.json({ message: 'Course added successfully', data: courses });
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const addClassrooms = async (req: Request, res: Response) => {
    try {
        const newClassrooms = req.body;
        if (!Array.isArray(newClassrooms)) {
            return res.status(400).json({ message: 'Classrooms must be an array' });
        }

        classrooms = newClassrooms.map(classroom => {
            if (typeof classroom !== 'string') {
                throw new Error('Classroom names must be strings');
            }
            return classroom;
        });

        console.log('Received classrooms:', classrooms);
        res.json({ message: 'Classrooms added successfully', data: classrooms });
    } catch (error) {
        console.error('Error adding classrooms:', error);
        res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid classroom data' });
    }
};

export const generateTimetable = (req: Request, res: Response) => {
    const missing: string[] = [];

    if (!teachers.length) missing.push('teachers');
    if (!courses.subjects.length) missing.push('subjects');
    if (!classrooms.length) missing.push('classrooms');

    if (missing.length) {
        return res.status(400).json({ message: `Missing data: ${missing.join(', ')}` });
    }

    try {
        const timetable = createTimetable();
        res.json(timetable);
    } catch (error) {
        console.error('Error generating timetable:', error);
        res.status(500).json({ message: 'Failed to generate timetable' });
    }
};

function createTimetable(): Record<string, Record<string, Record<string, { subject: string; teacher: string }>>> {
    const timetable: Record<string, Record<string, Record<string, { subject: string; teacher: string }>>> = {};

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const times = ['10:00 AM to 11:00 AM', '11:00 AM to 12:00 PM', '12:00 PM to 1:00 PM', '3:00 PM to 4:00 PM'];

    const subjects = courses.subjects;
    const numSubjects = subjects.length;
    
    for (const classroom of classrooms) {
        timetable[classroom] = {};

        for (const day of days) {
            timetable[classroom][day] = {};

            for (let i = 0; i < times.length; i++) {
                const subject = subjects[i % numSubjects];

                timetable[classroom][day][times[i]] = { 
                    subject: subject.name, 
                    teacher: subject.teacher 
                };
            }
        }
    }

    return timetable;
}

export default {
    addTeachers,
    addCourses,
    addClassrooms,
    generateTimetable
};