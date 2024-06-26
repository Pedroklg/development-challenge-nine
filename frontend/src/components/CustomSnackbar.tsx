import { Alert, Snackbar } from "@mui/material";

type CustomSnackbarProps = {
    snackbar: {
        isOpen: boolean,
        message: string,
        severity: "success" | "error",
    };
    setSnackbar: React.Dispatch<React.SetStateAction<{
        isOpen: boolean;
        message: string;
        severity: "success" | "error";
    }>>;
}

function CustomSnackbar({ snackbar, setSnackbar }: CustomSnackbarProps) {

    const closeSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbar({
            ...snackbar,
            isOpen: false
        });
    };

    return (
        <Snackbar open={snackbar.isOpen} autoHideDuration={6000} onClose={closeSnackbar}>
            <Alert
                onClose={closeSnackbar}
                severity={snackbar.severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
    )
}

export default CustomSnackbar;