//markdown形式にしたテキスト
let formatTxt = "";

//
const categorizeTxt = "    ";
const nextLayerTxt  = "   -";
 

document
	.getElementById("file-select-bt")
	.addEventListener("change", function(event) {
		let file = event.target.files[0];
		let relativePath = file.webkitRelativePath;
		formatTxt += relativePath.split("/").join('\n' + nextLayerTxt) + "\n";
		let prevDirArray = relativePath.split("/"); //過去調査中だったディレクトリ構造の配列

		for (let filei = 1; filei < event.target.files.length; filei++) {
			file = event.target.files[filei];
			relativePath = file.webkitRelativePath;
			let cureDirArray = relativePath.split("/"); //現在調査中のディレクトリ構造の配列

			//層の浅いほうを優先した探索(for)用の数値決め
			let len =
				cureDirArray.length > prevDirArray.length
					? cureDirArray.length
					: cureDirArray.length;

			//前の調査対象とどれだけ同じ階層にいるかを表す文字
			let categorizeStr = "";
			//階層数を表す添え字
			let diri = 1;
			//最上位層のディレクトリから順に調べていく
			for (; diri < len ; diri++) {
				//違う地点で階層位置を決定
				if (prevDirArray[diri] != cureDirArray[diri]) {
					break;
				} else {
					categorizeStr += categorizeTxt;
				}
			}
			if (diri < cureDirArray.length) {
				formatTxt += categorizeStr + nextLayerTxt;
				formatTxt += cureDirArray.slice(diri, cureDirArray.length).join('\n' + categorizeTxt +nextLayerTxt);
			}
			formatTxt += "\n";

			//次へ
			prevDirArray = cureDirArray;
		}
		console.log(formatTxt)
		document.getElementById("format-area").innerHTML = formatTxt;
	});

document.getElementById("copy-bt").addEventListener("click",copyToClipboard)

function copyToClipboard() {

		let txtTemp = document.createElement("textarea");
		txtTemp.setAttribute("id","copy-target")
		txtTemp.style.display = "block";
		txtTemp.textContent = formatTxt;
		document.body.appendChild(txtTemp)
		
			
		let copyTarget = document.getElementById("copy-target")
		
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
