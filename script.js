let formatTxt = ""

function createFormatTxt(fileList){
	const categorizeTxt = "    ";
	const nextLayerTxt = "-";
	let formatTxt = "";
	let prevDirArray = [];
		for (let filei = 0; filei < fileList.length; filei++) {
			let file = fileList[filei];
			
			let relativePath = file.webkitRelativePath;
			let cureDirArray = relativePath.split("/");

			//層の浅いほうを優先した探索(for)用の数値決め
			let len =
				cureDirArray.length > prevDirArray.length
					? cureDirArray.length
					: cureDirArray.length;

			//前の調査対象とどれだけ同じ階層にいるかを表す文字
			let categorizeStr = "";
			//階層数を表す添え字
			let diri = 0;
			for (; diri < len - 1; diri++) {
				//階層が違う場合は決定
				if (prevDirArray[diri] != cureDirArray[diri]) {
					break;
				} else {
					categorizeStr += categorizeTxt;
				}
			}
			for (; diri < cureDirArray.length; diri++) {
				formatTxt += categorizeStr + nextLayerTxt;
				formatTxt += cureDirArray[diri] + "\n";
				categorizeStr += categorizeTxt;
			}
			//次へ
			prevDirArray = cureDirArray;
		}
	return formatTxt;
}

/**
 * markdown形式の文字の描写
 */
let copyBlock = document.getElementById("copy-block");
copyBlock.style.display = "none";
document
	.getElementById("file-select-bt")
	.addEventListener("change", function(event) {
		console.log(event.target.files);
		formatTxt = createFormatTxt(event.target.files);
		if(formatTxt === "")copyBlock.style.display = "none";//初期段階では消しておく
		else copyBlock.style.display = "block";
		document.getElementById("format-area").innerHTML = formatTxt;
});


/**
 * コピーボタンの設定
 */
document.getElementById("copy-bt").addEventListener("click", copyToClipboard);
function copyToClipboard() {
	let txtTemp = document.createElement("textarea");
	txtTemp.setAttribute("id", "copy-target");
	txtTemp.style.display = "block";
	txtTemp.textContent = "```\n" + formatTxt + "```\n";
	document.body.appendChild(txtTemp);

	let copyTarget = document.getElementById("copy-target");

	copyTarget.select();
	var result = document.execCommand("copy");

	document.body.removeChild(txtTemp);

	return result;
}

/**
 * ドラッグ＆ドロップ機能 
 * */
let dragxdropDom = document.getElementById("drag-and-drop-area");

async function scanFiles(entry, tmpObject) {
	switch (true) {
			case (entry.isDirectory) :
					const entryReader = entry.createReader();
					const entries = await new Promise(resolve => {
							entryReader.readEntries(entries => resolve(entries));
					});
					await Promise.all(entries.map(entry => scanFiles(entry, tmpObject)));
					break;
			case (entry.isFile) :
					tmpObject.push({
						webkitRelativePath:entry.fullPath
					})
					break;
	}
}
dragxdropDom.addEventListener("dragover", function(event) {
	event.stopPropagation();
  event.preventDefault();
	event.dataTransfer.dropEffect = 'copy'; 
},false);
dragxdropDom.addEventListener("drop", async function(event) {
	event.stopPropagation();
	event.preventDefault();
	const items = event.dataTransfer.items;
  const results = [];
  const promise = [];
  for (const item of items) {
			const entry = item.webkitGetAsEntry();
      promise.push(scanFiles(entry, results));
  }
  await Promise.all(promise);
	console.log(results); //テスト表示
	formatTxt = createFormatTxt(results) 
	if(formatTxt === "")copyBlock.style.display = "none";//初期段階では消しておく
	else copyBlock.style.display = "block";
	document.getElementById("format-area").innerHTML = formatTxt;
},false);
