import { Subject } from './Subject'

export class Schedule {
    public id?: number
    constructor(
        public name: string,
        public userID: number,
        public subjects: Subject[] = []
    ) {}

    addSubject(subject: Subject) {
        const conflicts = this.checkConflicts(subject)

        if(conflicts.length > 0) {
            return { success: false, error: 'CONFLICTS_FOUND', conflicts }; //retorna a lista de materias conflitantes
        }

        this.subjects.push(subject);
        return { success: true };
    }

    removeSubject(subject: Subject) {
        const subjectExists = this.subjects.some(s => s.name === subject.name)

        if(!subjectExists) {
            return { success: false, error: 'NOT_FOUND' }   //materia para remover nao existe na grade
        }

        this.subjects = this.subjects.filter(s => s.name !== subject.name)
        return { success: true}
    }

    checkConflicts(newSubject: Subject) {
        return this.subjects.filter(s =>
            s.time === newSubject.time &&
            s.daysOfWeek.some(d => newSubject.daysOfWeek.includes(d))
        );
    }
}