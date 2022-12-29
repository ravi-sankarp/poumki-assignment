import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

type Props = {
  openDeleteModal: boolean;
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirmDelete: () => void;
};

function DeleteDialog({ openDeleteModal, setOpenDeleteModal, handleConfirmDelete }: Props) {
  return (
    <Dialog
      open={openDeleteModal}
      onClose={() => setOpenDeleteModal(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Confirm Delete Operation </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <p>Are you sure you want to delete all the users</p>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#339af0', '&:hover': { backgroundColor: '#1c7ed6' } }}
          onClick={() => setOpenDeleteModal(false)}
        >
          No
        </Button>
        <Button
          variant="contained"
          color="error"
          sx={{
            backgroundColor: '#fa5252',
            '&:hover': { backgroundColor: '#e03131' }
          }}
          onClick={handleConfirmDelete}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
