// MATH FUNCTIONS //
export const change = {
    // Converts Secs To Time --> Returns String
    secsToHMS: secs => {
        var pad = function(num, size) { return ('000' + num).slice(size * -1); },
        time = parseFloat(secs).toFixed(3),
        hours = Math.floor(time / 60 / 60),
        minutes = Math.floor(time / 60) % 60,
        seconds = Math.floor(time - minutes * 60)
        
        if (hours == 0) {
            if (minutes < 10) {
                return pad(minutes, 1) + ':' + pad(seconds, 2);
            }
            return pad(minutes, 2) + ':' + pad(seconds, 2);
        }
        return pad(hours, 1) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
    }
}