package com.shuttle

import android.os.Build
import android.os.Environment
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File
import java.io.FileNotFoundException
import java.io.FileOutputStream
import java.io.IOException

class AndroidDownloadFileManager internal constructor(context: ReactApplicationContext?) : ReactContextBaseJavaModule(context) {
    override fun getName(): String {
        return "AndroidDownloadFileManager"
    }

    @ReactMethod
    fun downloadFileToPublicDownloadDirectory(fileName: String?, fileContent: String, errorCallback: Callback, successCallback: Callback) {
        if (Build.VERSION.SDK_INT < 30) {
            errorCallback.invoke("Build version is 30 below", 104)
            return
        }
        val root = File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), fileName)
        try {
            val fout = FileOutputStream(root)
            fout.write(fileContent.toByteArray())
            fout.close()
            successCallback.invoke("File created", 101)
        } catch (e: FileNotFoundException) {
            try {
                // try to create the file
                if (root.createNewFile()) {
                    // call the method again
                    downloadFileToPublicDownloadDirectory(fileName, fileContent, errorCallback, successCallback)
                } else {
                    errorCallback.invoke("Failed to create file", 102)
                }
            } catch (ex: IOException) {
                errorCallback.invoke("Something went wrong. Please try again", 103)
            }
        } catch (e: IOException) {
            errorCallback.invoke("Something went wrong. Please try again", 103)
        }
    }
}
