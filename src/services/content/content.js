export function getCaret (element) {
	/** https://stackoverflow.com/questions/
	 * 4811822/get-a-ranges-start-and-end-offsets-relative-to-its-parent-container/4812022#4812022 **/
	let start = 0
	let end = 0
	const doc = element.ownerDocument || element.document
	const win = doc.defaultView || doc.parentWindow
	let sel

	if (typeof win.getSelection !== 'undefined') {
		sel = win.getSelection()
		if (sel.rangeCount > 0) {
			const range = win.getSelection().getRangeAt(0)
			const preCaretRange = range.cloneRange()
			preCaretRange.selectNodeContents(element)
			preCaretRange.setEnd(range.startContainer, range.startOffset)
			start = preCaretRange.toString().length
			preCaretRange.setEnd(range.endContainer, range.endOffset)
			end = preCaretRange.toString().length
		}
	} else if ((sel = doc.selection) && sel.type !== 'Control') {
		const textRange = sel.createRange()
		const preCaretTextRange = doc.body.createTextRange()
		preCaretTextRange.moveToElementText(element)
		preCaretTextRange.setEndPoint('EndToStart', textRange)
		start = preCaretTextRange.text.length
		preCaretTextRange.setEndPoint('EndToEnd', textRange)
		end = preCaretTextRange.text.length
	}
	return { start: start, end: end }
}

export function setCaret ($node, offset = undefined) {
	/** Set caret to offset position or **/
	const range = document.createRange()
	const selection = window.getSelection()

	const actualNode = $node?.lastChild ? $node.lastChild : $node

	const length = $node?.lastChild?.length ? $node?.lastChild?.length : 0

	if (offset === undefined) {
		offset = length
	}

	// The Range.setStart() method sets the start position of a Range.
	// https://developer.mozilla.org/en-US/docs/Web/API/Range/setStart
	range.setStart(actualNode, offset + 1)

	// The Range.collapse() method collapses the Range to one of its boundary points.
	// Look here https://developer.mozilla.org/en-US/docs/Web/API/Range/collapse
	range.collapse(true)

	// Experimental!  The Selection.removeAllRanges() method removes all ranges from the selection,
	// leaving the anchorNode and focusNode properties equal to null and leaving nothing selected.
	// https://developer.mozilla.org/en-US/docs/Web/API/Selection/removeAllRanges
	selection.removeAllRanges()

	// The Selection.addRange() method adds a Range to a Selection.
	// https://developer.mozilla.org/en-US/docs/Web/API/Selection/addRange
	selection.addRange(range)

	range.detach() // Optimization
}
