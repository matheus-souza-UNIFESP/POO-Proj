import { Subject } from './Subject'
import { User } from './User'

export class Schedule {
    public id?: number
    constructor(
        public name: string,
        public userID: number,
        public subjects: Subject[] = []
    ) {}

    addSubject(subject: Subject){
        if(this.checkConflict(subject))
            console.log('Conflito de horário')
        else
            this.subjects.push(subject)
    }

    removeSubject(subject: Subject){
        this.subjects = this.subjects.filter(s => s.name !== subject.name)
    }

    checkConflict(subject: Subject): boolean{
        for(let s of this.subjects){
            for(let d of subject.daysOfWeek){
                if (s.daysOfWeek.includes(d))
                    return true
            }
        }
        return false
    }
}