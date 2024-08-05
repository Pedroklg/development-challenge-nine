export const validateDate = (birth_date: string) => {
    if (!birth_date) {
        return 'Data de nascimento inválida';
    }
    
    const date = new Date(birth_date);
    const today = new Date();

    if (date > today) {
        return 'Data de nascimento inválida';
    }

    return;
}