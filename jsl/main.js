ascii_string = '!"#$%&()*+-/0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_{|}~'

// FIX
// var json_to_load = {
// 	"bookmarks": {
// 		1: {
// 			"url": "https://youtube.com",
// 			"cpt": "YouTube",
// 			"img": "img/youtube.png",
// 		},
// 		2: {
// 			"url": "https://vk.com",
// 			"cpt": "VK",
// 			"img": "img/vk.svg"
// 		}
// 	}
// }

// for (let k of Object.keys(json_to_load)) {
// 	localStorage.setItem(k, JSON.stringify(json_to_load[k]))
// }

document.addEventListener("DOMContentLoaded", main)

function main() {
	// doc_title_char_fall("Wake the fck up, samurai", ">")y

	var bkmr_elem = document.body.querySelector(".bookmark.cnt")
	var add_mdl = document.body.querySelector("dialog.add.modal")
	var del_mdl = document.body.querySelector("dialog.delete.modal")

	// STRUCTURE
	draw_bkmr_itms(bkmr_get_data().bookmarks, bkmr_elem, add_mdl, del_mdl)

	// EVENT LISTENERS
	// Adding modal
	// Cancel Button
	add_mdl.querySelector(".button.cancel").addEventListener("click", (e) => {
		add_mdl.querySelector('input[name="nme"]').value = null
		add_mdl.querySelector('input[name="url"]').value = null
		add_mdl.querySelector('input[name="img"]').value = null
		modal_close_fade_out(add_mdl)
	})
	// Save Button
	add_mdl.querySelector(".button.save").addEventListener("click", () => {
		let bkmk = bkmr_get_data().bookmarks
		let nme = add_mdl.querySelector('input[name="nme"]')
		let url = add_mdl.querySelector('input[name="url"]')
		let img = add_mdl.querySelector('input[name="img"]') 
		let item_id = Object.keys(bkmk).map(x => Number(x)).reduce((a, b) => Math.max(a, b), -Infinity) + 1
		
		bkmk[item_id] = {cpt: nme.value, url: url.value, img: img.value}
		localStorage.bookmarks = JSON.stringify(bkmk)
		nme.value = null
		url.value = null
		img.value = null
		re_draw_bkmr_itms(bkmr_get_data().bookmarks, bkmr_elem, add_mdl, del_mdl)
		add_mdl.close()
	})
	// Delete modal
	// Cancel Button
	del_mdl.querySelector(".button.cancel").addEventListener("click", (e) => {
		del_mdl.querySelector(".button.delete").setAttribute("del_id", null)
		modal_close_fade_out(del_mdl, 0.3)
	})
	// Delete Button
	del_mdl.querySelector(".button.delete").addEventListener("click", (e) => {
		let bkmk = bkmr_get_data().bookmarks
		let del_id = e.target.getAttribute("del_id")
		delete bkmk[del_id]
		localStorage.bookmarks = JSON.stringify(bkmk)
		re_draw_bkmr_itms(bkmr_get_data().bookmarks, bkmr_elem, add_mdl, del_mdl)
		del_mdl.close()
	})

}

//#region TITLE CHANGER
// async function doc_title_char_fall (str, prompt) {
// 	str 	= str.replaceAll(" ", "​​\u205f​​​")
// 	prompt 	= prompt.replaceAll(" ", "​​\u205f​​​")
// 	let len = str.length
// 	document.title = prompt
// 	for (let char of str) {
// 		document.title += "_"
// 		// for (let i = 0; i < 3; i++) {
// 		// 	let mash_char = ascii_string[Math.floor(Math.random()*ascii_string.length)]
// 		// 	document.title = document.title.replaceAt(document.title.length-1, mash_char)
// 		// 	await timer(100)
// 		// }
// 		await timer(100)
// 		document.title = document.title.replaceAt(document.title.length-1, char)
// 	}
// }
//#endregion TITLE CHANGER
function re_draw_bkmr_itms(data, par_elm, add_mdl_elm, del_mdl_elm) {
	par_elm.replaceChildren("")
	draw_bkmr_itms(data, par_elm, add_mdl_elm, del_mdl_elm)
}
// DRAW FUNCTIONS
function draw_bkmr_itms(data, par_elm, add_mdl_elm, del_mdl_elm) {
	for (let idd of Object.keys(data)) {
		let itm = data[idd]
		let itm_elm = document.createElement("div")
		itm_elm.className = "bookmark item"
		itm_elm.setAttribute("lnk", itm.url)
		itm_elm.addEventListener("click", function () {
			window.open(this.getAttribute("lnk"), "_blank")
		})
		// Image element // FIX: Add this only if image is loaded 
		let img_elm = document.createElement("div")
		if (itm.img != null) {
			let img = new Image()
			img.onload = function () {
				img_elm.className = "bookmark image"
				img_elm.appendChild(img)
			}
			img.src = itm.img
		}
		itm_elm.appendChild(img_elm)
		// Caption
		let cpt_elm = document.createElement("div")
		cpt_elm.className = "caption"
		// cpt_elm.innerText = itm.cpt
		cpt_elm.innerHTML = '<div class="cpt_txt">' + itm.cpt + '</div>'
		itm_elm.appendChild(cpt_elm)
		// Delete button
		let del_elm = document.createElement("div")
		del_elm.className = "delete button"
		del_elm.addEventListener("click", function (e) {
			e.stopPropagation()
			// del_mdl_elm.showModal()
			modal_show_fade_in(del_mdl_elm)
			del_mdl_elm.querySelector('.button.delete').setAttribute("del_id", idd)
		})
		itm_elm.appendChild(del_elm)
		par_elm.appendChild(itm_elm)
		// let del_mdl = document.createElement("dialog")
	}

	// Add bookmark
	let add_itm_elm = document.createElement("div")
	add_itm_elm.className = "bookmark item add"
	add_itm_elm.addEventListener("click", function () {
		// TODO: Showing modal and adding 
		// console.log("add", this)
		modal_show_fade_in(add_mdl_elm)
	})
	// Plus sign
	let pls_elm = document.createElement("div")
	pls_elm.className = "text_icon"
	pls_elm.innerText = "+"
	add_itm_elm.appendChild(pls_elm)
	par_elm.appendChild(add_itm_elm)
}

// EFFECTS FUNCTIONS
function remove_elem_fade_out(elem, seconds) {
	elem.style.transition = "opacity " + seconds + "s ease";
	elem.style.opacity = 0;

	setTimeout(function () {
		elem.parentNode.removeChild(elem);
	}, speed);
}

function modal_show_fade_in(modal) {
	modal.showModal();
	modal.classList.add("shown");
	// modal.style.setProperty('--backdrop-opacity', 0.3)
	// modal.style.opacity = 1;
	// modal.style.scale = 1;
}
function modal_close_fade_out(modal) {
	modal.classList.remove("shown");

	setTimeout(function () {
		modal.close();
	}, Number(window.getComputedStyle(modal).transitionDuration.slice(0, -1)) * 1000); // Get Transition duration, slice the "s" symbol,
	//	cast to number and set it as Timeout value 
}

// DATA FUNCTIONS
function bkmr_get_data() {
	let res = {}
	for (let k of Object.keys(localStorage)) {
		res[k] = JSON.parse(localStorage[k])
	}
	return res
}

