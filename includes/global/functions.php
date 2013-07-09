<?php

    // ********************************
    // Variables
    // ********************************

    // boolen (true / false) to determine if orange box for hiring is visble
    $show_hiring_box = false;
    $minify_enabled = true;

    // ********************************
    // CSS Minification
    // ********************************
    // Require the compressor
    require($site_path . 'libraries/cssmin.php');
    function minifyCSS($filename) {

        global $site_url;
        global $site_path;
        global $minify_enabled;

        if ($minify_enabled == true) {

            // Extract the CSS code you want to compress from your CSS files
            $inputCSS = file_get_contents($site_path . 'assets/styles/' . $filename);

            // Create a new CSSmin object.
            // By default CSSmin will try to raise PHP settings.
            // If you don't want CSSmin to raise the PHP settings pass FALSE to
            // the constructor i.e. $compressor = new CSSmin(false);
            $compressor = new CSSmin();

            // Override any PHP configuration options before calling run() (optional)
            $compressor->set_memory_limit('256M');
            $compressor->set_max_execution_time(120);

            // Compress the CSS code in 1 long line and store the result in a variable
            $outputCSS = $compressor->run($inputCSS);

            // You can change any PHP configuration option between run() calls
            // and those will be applied for that run
            $compressor->set_pcre_backtrack_limit(3000000);
            $compressor->set_pcre_recursion_limit(150000);

            // add .min to the file name before .css
            $fileNameBits = explode('.', $filename);
            $originalSuffix = array_pop($fileNameBits);
            array_push($fileNameBits, 'min');
            array_push($fileNameBits, $originalSuffix);
            $new_filename = implode('.', $fileNameBits);

             // write output to file
            file_put_contents($site_path . 'assets/styles/' . $new_filename, $outputCSS);

            // define the minified file url
            $url = $site_url . 'assets/styles/' . $new_filename;

        } else {
            // define the original url
            $url = $site_url . 'assets/styles/' . $filename;
        }
        // return the proper url
        echo($url);
    }

?>