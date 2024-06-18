import React, { useCallback, useRef, useState } from "react";
import { useFormikContext } from "formik";
import {
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    Box,
} from "@mui/material";

const ImageField: React.FC = () => {
    const { setFieldValue } = useFormikContext();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePaste = useCallback(
        (event: ClipboardEvent) => {
            const items = event.clipboardData?.items;
            if (items) {
                for (const item of items) {
                    if (item.type.startsWith("image/")) {
                        const file = item.getAsFile();
                        if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setFieldValue("image", reader.result);
                                setImagePreview(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                        }
                    }
                }
            }
        },
        [setFieldValue]
    );

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFieldValue("image", reader.result);
                    setImagePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        },
        [setFieldValue]
    );

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleCancel = () => {
        setFieldValue("image", "");
        setImagePreview(null);
    };

    React.useEffect(() => {
        window.addEventListener("paste", handlePaste);
        return () => {
            window.removeEventListener("paste", handlePaste);
        };
    }, [handlePaste]);

    return (
        <Box>
            <Button
                onClick={handleClick}
                variant="contained"
                color="primary"
                fullWidth
            >
                Upload Image
            </Button>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleChange}
            />
            <Box mt={2} display="flex" justifyContent="space-between">
                {imagePreview && (
                    <>
                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            variant="contained"
                            color="secondary"
                        >
                            Preview
                        </Button>
                        <Button
                            onClick={handleCancel}
                            variant="contained"
                            color="primary"
                        >
                            Cancel
                        </Button>
                    </>
                )}
            </Box>
            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            >
                <DialogContent>
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ width: "100%" }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setIsDialogOpen(false)}
                        color="primary"
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ImageField;
