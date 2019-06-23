window.onload = () => {
    console.log('boo')
    const button = document.getElementsByTagName('button')[0];
    button.onclick = () => {
        var mywindow = window.open("index2.html", "mywindow", "location=1,status=1,scrollbars=1,  width=100,height=100");
        mywindow.moveTo(0, 0);
    }
} 