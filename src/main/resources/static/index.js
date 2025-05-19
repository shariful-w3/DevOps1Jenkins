$(document).ready(function() {
	let secondsElapsed = 0;
	let timerInterval;
    let currentPage = 0;  // Default to page 0

	$("#pageValue").val(currentPage);
	$("#pageValue").text(currentPage);

	// Load report on page load
	loadScrapingReport();
	
	// Refresh report on button click
	$("#refreshReportBtn").click(function() {
		loadScrapingReport();
	});

	$("#startSendingEmail").click(function() {
		const batchCount = $("#batchCount").val();

		if (!batchCount) {
			alert("Must input batch limit");
			return;
		}

		// Reset counter and update modal
		secondsElapsed = 0;
		$("#timer").text("0s");
		$("#loadingModal").modal({
			backdrop: 'static', // Prevent closing by clicking outside
			keyboard: false // Prevent closing with Esc key
		}).modal("show");

		// Start timer
		timerInterval = setInterval(() => {
			$("#timer").text(++secondsElapsed + "s");
		}, 1000);

		$.ajax({
			url: "/start-email-sending-process",
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify({ batchCount }),
			success: function(response) {
				$("#loadingModal").modal("hide");

				$("#responseMessage").html(`<div class="alert alert-success">${response.message}</div>`);
			},
			error: function() {
				$("#responseMessage").html(`<div class="alert alert-danger">Error generating report.</div>`);
			},
			complete: function() {
				clearInterval(timerInterval); // Stop timer
				$("#loadingModal").modal("hide"); // Hide modal when request is complete
			}
		});
	});

	$("#startSearchingEmail").click(function() {
		const searchText = $("#keywords").val();
		const pageValue = $("#pageValue").val();

		if (!searchText) {
			alert("Must input batch limit");
			return;
		}

		// Reset counter and update modal
		secondsElapsed = 0;
		$("#timer").text("0s");
		$("#loadingModal").modal({
			backdrop: 'static', // Prevent closing by clicking outside
			keyboard: false // Prevent closing with Esc key
		}).modal("show");

		// Start timer
		timerInterval = setInterval(() => {
			$("#timer").text(++secondsElapsed + "s");
		}, 1000);

		$.ajax({
			url: "/search",
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify({ searchText, pageValue }),
			success: function(response) {
				$("#loadingModal").modal("hide");
				$("#pageValue").val(response.next);
				$("#pageValue").text(response.next);
				//$("#startSearchingEmail").text('Next');

					let tableHtml = `
				        <table class="table table-bordered table-striped">
				            <thead>
				                <tr>
				                    <th>#</th>
				                    <th>Email Address</th>
				                </tr>
				            </thead>
				            <tbody>`;

				response.data.forEach((email, index) => {
					tableHtml += `
				            <tr>
				                <td>${index + 1}</td>
				                <td>${email}</td>
				            </tr>`;
				});

				tableHtml += `
					            </tbody>
					        </table>`;

				$("#responseMessage").html(tableHtml);
			},
			error: function() {
				$("#responseMessage").html(`<div class="alert alert-danger">Error in search.</div>`);
			},
			complete: function() {
				clearInterval(timerInterval); // Stop timer
				$("#loadingModal").modal("hide"); // Hide modal when request is complete
			}
		});
	});

	$("#startFullSearchingEmail").click(function() {

		const searchText = 'some';

		// Reset counter and update modal
		secondsElapsed = 0;
		$("#timer").text("0s");
		$("#loadingModal").modal({
			backdrop: 'static', // Prevent closing by clicking outside
			keyboard: false // Prevent closing with Esc key
		}).modal("show");

		// Start timer
		timerInterval = setInterval(() => {
			$("#timer").text(++secondsElapsed + "s");
		}, 1000);

		$.ajax({
			url: "/process",
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify({ searchText }),
			success: function(response) {
				$("#loadingModal").modal("hide");

					let tableHtml = `
				        <table class="table table-bordered table-striped">
				            <thead>
				                <tr>
				                    <th>#</th>
				                    <th>Email Address</th>
				                </tr>
				            </thead>
				            <tbody>`;

				response.data.forEach((email, index) => {
					tableHtml += `
				            <tr>
				                <td>${index + 1}</td>
				                <td>${email}</td>
				            </tr>`;
				});

				tableHtml += `
					            </tbody>
					        </table>`;

				$("#responseMessage").html(tableHtml);
			},
			error: function() {
				$("#responseMessage").html(`<div class="alert alert-danger">Error in search.</div>`);
			},
			complete: function() {
				clearInterval(timerInterval); // Stop timer
				$("#loadingModal").modal("hide"); // Hide modal when request is complete
			}
		});
	});


	$("#closeModalBtn").click(function() {
		clearInterval(timerInterval); // Stop timer when closing
		$("#loadingModal").modal("hide");
	});
	
		$("#clearSearchingEmail").click(function() {
		$("#keywords").val('');
		$("#pageValue").val(0);
		$("#pageValue").text('0');
		$("#startSearchingEmail").text('Search');

	});
	
	function loadScrapingReport() {
	$.ajax({
		url: "/scrap-report",  // Update this to your actual endpoint
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify({}), // You can send SearchVm data if needed
		success: function(response) {
			if (!response || response.length === 0) {
				$("#scrapingReportTable").html("<div class='alert alert-info'>No data available</div>");
				return;
			}

			let report = response.data;

			let tableHtml = `
				<table class="table table-bordered table-sm">
					<thead>
						<tr>
							<th>Total Search Key</th>
							<th>Completed</th>
							<th>Pending</th>
							<th>Total Emails</th>
							<th>Unique Emails</th>
							<th>Gmail Count</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td style="font-size:20px; color:blue; font-weight:bold;">${report.totalSearchKey}</td>
							<td style="font-size:20px; color:blue; font-weight:bold;">${report.completedSearchKey}</td>
							<td style="font-size:20px; color:blue; font-weight:bold;">${report.pendingSearchKey}</td>
							<td style="font-size:20px; color:blue; font-weight:bold;">${report.totalEmailExtracted}</td>
							<td style="font-size:20px; color:red; font-weight:bold;">${report.uniqueEmailExtracted}</td>
							<td style="font-size:20px; color:blue; font-weight:bold;">${report.gmailExtracted}</td>
						</tr>
					</tbody>
				</table>`;

			$("#scrapingReportTable").html(tableHtml);
		},
		error: function() {
			$("#scrapingReportTable").html("<div class='alert alert-danger'>Failed to load report</div>");
		}
	});
}

});
