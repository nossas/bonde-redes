import { useState } from 'react'
/*import { useLocation } from 'react-router-dom'*/
/*import qs from 'query-string'*/

const FilterQuery = ({ children }) => {
	const [page, setPage] = useState(0)
	const [rows, setRows] = useState(20)
	const [status, setStatus] = useState()
	const [availability, setAvailability] = useState()

	const filtered = {
		rows: rows,
		offset: page * rows,
		status: !!status ? { _eq: status } : undefined,
		availability: !!availability ? { _eq: availability } : undefined
	}

	const changeFilters = ({ page, rows, status, availability }) => {
		if (page) setPage(page)
		if (rows) setRows(rows)
		if (status) setStatus(status === 'all' ? undefined : status)
		if (availability) setAvailability(availability === 'all' ? undefined : availability)
	}

	return children({ filters: filtered, changeFilters })
}

export default FilterQuery
