export const validateDate = (birth_date: string) => {
    if (!birth_date || birth_date.length < 10) {
        return 'Data de nascimento inválida';
    }
    
    const date = new Date(birth_date);
    const today = new Date();

    if (date > today) {
        return 'Data de nascimento inválida';
    }

    return;
}