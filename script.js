//markdown形式にしたテキスト
let formatTxt = "";

const categorizeTxt = "    ";
const nextLayerTxt = "   -";

/**
 * markdown形式の文字の描写位置
 */
document
	.getElementById("file-select-bt")
	.addEventListener("change", function(event) {
		formatTxt = "";
		
		let prevDirArray = [];
		for (let filei = 0; filei < event.target.files.length; filei++) {
			let file = event.target.files[filei];
			let relativePath = file.webkitRelativePath;
			let	cureDirArray = relativePath.split("/");

			//層の浅いほうを優先した探索(for)用の数値決め
			let len =
				cureDirArray.length > prevDirArray.length
					? cureDirArray.length
					: cureDirArray.length;

			//前の調査対象とどれだけ同じ階層にいるかを表す文字
			let categorizeStr = "";
			//階層数を表す添え字
			let diri = 0;
			for(; diri < len - 1; diri++){
				//階層が違う場合は決定
				if (prevDirArray[diri] != cureDirArray[diri]) {
					break;
				} else {
					categorizeStr += categorizeTxt;
				}
			}
			for(; diri < cureDirArray.length; diri++){
				formatTxt += categorizeStr + nextLayerTxt;
				formatTxt += cureDirArray[diri] + "\n";
				categorizeStr += categorizeTxt;
			}
			//次へ
			prevDirArray = cureDirArray;

		}
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
	txtTemp.textContent = formatTxt;
	document.body.appendChild(txtTemp);

	let copyTarget = document.getElementById("copy-target");

	copyTarget.select();
	// クリップボードにコピー
	var result = document.execCommand("copy");

	document.body.removeChild(txtTemp);

	return result;
}

/* */
// let dragxdropDom = document.getElementById("drag-and-drop-area");
// dragxdropDom.addEventListener(
// 	"dragover",
// 	event => {
// 		event.preventDefault();
// 	},
// 	false
// );

// let fileInput = document.getElementById("file-select-bt");
// dragxdropDom.addEventListener(
// 	"drop",
// 	event => {
// 		event.preventDefault();

// 		// Dropされた1つ目のファイルを扱います.
// 		var file = event.dataTransfer.files[0];

// 		console.log(file);
// 		// FileReaderによる読み取り
// 		var fileReader = new FileReader();
// 		fileReader.onload = function(event) {
// 			console.log(event.target.result);
// 			//AjaxでサーバーにPOST
// 			var xhr = new XMLHttpRequest();
// 			xhr.open("GET", "/");
// 			xhr.setRequestHeader(
// 				"content-type",
// 				"application/x-www-form-urlencoded;charset=UTF-8"
// 			);
// 			xhr.send("file=" + event.target.result);
// 		};
// 		fileReader.readAsText(file);
// 	},
// 	false
// );
