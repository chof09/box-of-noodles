let imgs = [];
const imgUrls = [
    'imgs/garbage-trash-droppable-light.png',
    'imgs/garbage-trash-droppable-norm.png'
    ];
for (let i = 0; i < imgUrls.length; i++) {
    imgs.push(new Image());
    imgs[i].src = imgUrls[i];
}