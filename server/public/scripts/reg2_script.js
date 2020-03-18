const selectElement = s => document.querySelector(s);

// Open menu on click
selectElement(".open").addEventListener("click", () => {
  selectElement(".nav-list").classList.add("active");
});

// Close menu on click
selectElement(".close").addEventListener("click", () => {
  selectElement(".nav-list").classList.remove("active");
});

// Register the plugin with FilePond
FilePond.registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview, FilePondPluginFileValidateSize, FilePondPluginFileRename);

FilePond.create(
    document.querySelector('input[type="file"]'), {
        labelIdle: `Add<br>Image`,
        imagePreviewHeight: 60,
        maxFileSize: '750kb',
        labelMaxFileSize: 'Maximum file size is 750kb',
        imageCropAspectRatio: '1:1',
        imageResizeTargetWidth: 70,
        imageResizeTargetHeight: 70,
        stylePanelLayout: 'compact circle',
        styleLoadIndicatorPosition: 'center bottom',
        styleProgressIndicatorPosition: 'right bottom',
        styleButtonRemoveItemPosition: 'left bottom',
        styleButtonProcessItemPosition: 'right bottom',
    }
);
