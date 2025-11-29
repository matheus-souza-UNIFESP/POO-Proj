import { Subject } from './Subject'

/*
    Entidade do domínio representando as grades
    NÃO se comunica com o BD ou HTTP
*/

export class Schedule {
    public id?: number
    constructor(
        public name: string,
        public userID: number,
        public subjects: Subject[] = []
    ) {}

    //Adiciona uma matéria à grade
    //Se houver conflito retorna a lista de matérias conflitantes
    addSubject(subject: Subject) {
        const conflicts = this.checkConflicts(subject)

        if(conflicts.length > 0) {
            return { success: false, error: 'CONFLICTS_FOUND', conflicts };
        }

        this.subjects.push(subject)
        return { success: true }
    }

    //Remove uma matéria da grade
    //Retorna erro se a matéria para remover não existe na grade
    removeSubject(subject: Subject) {
        const subjectExists = this.subjects.some(s => s.name === subject.name)

        if(!subjectExists) {
            return { success: false, error: 'NOT_FOUND' }
        }

        this.subjects = this.subjects.filter(s => s.name !== subject.name)
        return { success: true}
    }

    //Verifica se o horário da nova matéria se sobrepõe com o horário de outras matérias
    //Retorna a lista de aulas conflitantes, vazia se não houverem
    checkConflicts(newSubject: Subject) {
        const conflicts = []
        for(const existing of this.subjects) {
            for(const exClass of existing.classes) {
                const conflict = newSubject.classes.find(newClass =>
                    newClass.day === exClass.day &&
                    newClass.time === exClass.time
                )

                if(conflict) {
                    conflicts.push({
                        subject: existing,
                        existingClass: exClass,
                        newClass: conflict
                    })
                }
            }
        }

        return conflicts
    }
}