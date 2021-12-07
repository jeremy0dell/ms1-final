import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

// import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import "@fontsource/montserrat";


import poster from './data/NMAH-AC0433-0003439.jpeg'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '.MuiDialog-paper': {
        height: '1000px',
        width: '1200px',
        backgroundColor: 'rgb(30, 30, 30)',
        color: 'white'
    },
    '.MuiBackdrop-root': {
      backdropFilter: 'blur(3px)'
    },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
            X
          {/* <CloseIcon /> */}
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const steps = ['Introduction', 'Information', 'Instructions'];
const stepContents = [
    <div style={{ fontFamily: "Montserrat" }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>Welcome to</div>
      <div style={{fontSize: 50, color: 'wheat', fontFamily: 'Stardos Stencil', textAlign: 'center'}}>Decoding Conflict</div>
      <div style={{fontSize: 25, color: 'wheat', fontFamily: 'Stardos Stencil',  textAlign: 'center'}}>An exploratory visualization of The National Museum of American History’s wartime propaganda poster collection</div>
      <div style={{ textAlign: 'center', marginTop: '40px' }}>This project seeks to allow users to explore the NMAH's expansive wartime propaganda poster collection. This large digitized collection is expansive with metadata, visually stunning, and rich in cultural history.</div>
    </div>,
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 18px' }}>
    <div style={{ overflowY: 'scroll', marginRight: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
    <div>The Princeton University Library donated this extensive collection of World War I and World War II materials to the Smithsonian Institution in 1963 and 1967.</div>
    <div>In 1990 and again in 1991, the NMAH Division of Conservation was awarded Smithsonian Research Resources grants to conserve and catalog the collection. The posters in the crates were in extremely precarious condition, evidencing extensive tears, water damage, dirt, mold, and insect damage. Their condition was so extreme that handling, cataloging, or mere counting was not deemed possible outside of a major rehousing project.</div>
    <div>Staff from the Digitization Program Office's Mass Digitization (Mass Digi) team, the National Museum of American History, and the Transcription Center worked together to digitize over 10,000 Princeton Posters' catalog sheets and import them into the Transcription Center as new projects. Created in the 1990's, these sheets contain information on when each poster was produced, what issuing organization created it, what language or languages it is written in, the content and topic of the poster, and more. Over a few months, 381 volunpeers transcribed all the data on each catalog sheet, recording this important information in record time. Alongside this work, the Mass Digi team collaborated with NMAH's Archives Center and the Division of Political and Military History,to digitize all of the posters themselves (totaling more than 18,000).</div>
    </div>
    <div>
      <img src={poster} />
    </div>
  </div>,
  <Typography gutterBottom>
    Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
    magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
    ullamcorper nulla non metus auctor fringilla.
  </Typography>,
]

export default function CustomizedDialogs({ open, setOpen }) {
    // needs open and setOpen

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // stepper code
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };


  return (
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="false"
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose} />
        <DialogContent dividers>
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Stepper sx={{ color: 'white' }} activeStep={activeStep}>
                {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                return (
                    <Step key={label} {...stepProps}>
                    <StepLabel sx={{ 'MuiStepLabel-label': {color: 'white'} }} {...labelProps}>{label}</StepLabel>
                    </Step>
                );
                })}
            </Stepper>
            <Typography sx={{ mt: 2, mb: 1, fontSize: '20px' }}>{stepContents[activeStep]}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                color="inherit"
                variant="outlined"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
                >
                Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button sx={{ color: '#6eadeb', border: '1px solid #6eadeb' }} variant="outlined" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </Box>
            </Box>
          {/* <Typography gutterBottom>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
            dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
            consectetur ac, vestibulum at eros.
          </Typography>
          <Typography gutterBottom>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
            Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
          </Typography>
          <Typography gutterBottom>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
            magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
            ullamcorper nulla non metus auctor fringilla.
          </Typography> */}
        </DialogContent>
      </BootstrapDialog>
  );
}